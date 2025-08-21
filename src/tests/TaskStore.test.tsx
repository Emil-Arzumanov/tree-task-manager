import { taskStore } from "@store/TaskStore";
import { describe, test, expect, beforeEach, vi } from "vitest";

const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	clear: vi.fn(),
};

const cryptoMock = {
	randomUUID: vi.fn(() => Math.random().toString(36).substring(2, 15)),
};

beforeEach(() => {
	vi.stubGlobal("localStorage", localStorageMock);
	vi.stubGlobal("crypto", cryptoMock);

	localStorageMock.clear.mockClear();
	localStorageMock.setItem.mockClear();
	localStorageMock.getItem.mockClear();
	cryptoMock.randomUUID.mockClear();

	taskStore.tasks = [];
	taskStore.searchFilter = "";
});

describe("TaskStore - Basic Functionality", () => {
	test("should add a task", () => {
		taskStore.addTask(null, "Test Task", "Test description");
		// Had to do it, because id is a randomly generated number
		taskStore.tasks[0].id = "1";

		expect(taskStore.tasks).toHaveLength(1);
		expect(taskStore.tasks[0]).toEqual({
			id: "1",
			title: "Test Task",
			text: "Test description",
			completed: false,
			collapsed: false,
			children: [],
			parentId: null,
		});
	});

	test("should remove a task", () => {
		taskStore.addTask(null, "Task to remove", "");
		const taskId = taskStore.tasks[0].id;

		taskStore.removeTask(taskId);

		expect(taskStore.tasks).toHaveLength(0);
	});

	test("should toggle task completion", () => {
		taskStore.addTask(null, "Test Task", "");
		const taskId = taskStore.tasks[0].id;

		taskStore.toggleTask(taskId);
		expect(taskStore.tasks[0].completed).toBe(true);

		taskStore.toggleTask(taskId);
		expect(taskStore.tasks[0].completed).toBe(false);
	});

	test("child should toggle parent task completion", () => {
		taskStore.addTask(null, "Parent Task", "I am parent");
		const parentTaskId = taskStore.tasks[0].id;
		taskStore.addTask(parentTaskId, "Child Task 1", "I am child 1");
		const childTaskId1 = taskStore.tasks[0].children[0].id;
		taskStore.addTask(parentTaskId, "Child Task 2", "I am child 2");
		const childTaskId2 = taskStore.tasks[0].children[1].id;
		taskStore.addTask(parentTaskId, "Child Task 3", "I am child 3");
		const childTaskId3 = taskStore.tasks[0].children[2].id;

		taskStore.toggleTask(childTaskId1);
		expect(taskStore.tasks[0].children[0].completed).toBe(true);
		taskStore.toggleTask(childTaskId2);
		expect(taskStore.tasks[0].children[1].completed).toBe(true);
		taskStore.toggleTask(childTaskId3);
		expect(taskStore.tasks[0].children[2].completed).toBe(true);

		expect(taskStore.tasks[0].completed).toBe(true);

		taskStore.toggleTask(childTaskId2);
		expect(taskStore.tasks[0].completed).toBe(false);
		expect(taskStore.tasks[0].children[0].completed).toBe(true);
		expect(taskStore.tasks[0].children[1].completed).toBe(false);
		expect(taskStore.tasks[0].children[2].completed).toBe(true);
	});

	test("parent should toggle child task completion", () => {
		taskStore.addTask(null, "Parent Task", "I am parent");
		const parentTaskId = taskStore.tasks[0].id;
		taskStore.addTask(parentTaskId, "Child Task 1", "I am child 1");
		taskStore.addTask(parentTaskId, "Child Task 2", "I am child 2");
		taskStore.addTask(parentTaskId, "Child Task 3", "I am child 3");

		taskStore.toggleTask(parentTaskId);
		expect(taskStore.tasks[0].completed).toBe(true);
		expect(taskStore.tasks[0].children[0].completed).toBe(true);
		expect(taskStore.tasks[0].children[1].completed).toBe(true);
		expect(taskStore.tasks[0].children[2].completed).toBe(true);

		taskStore.toggleTask(parentTaskId);
		expect(taskStore.tasks[0].completed).toBe(false);
		expect(taskStore.tasks[0].children[1].completed).toBe(false);
		expect(taskStore.tasks[0].children[2].completed).toBe(false);
		expect(taskStore.tasks[0].children[2].completed).toBe(false);
	});

	test("should edit task title and text", () => {
		taskStore.addTask(null, "Old Title", "Old text");
		const taskId = taskStore.tasks[0].id;

		expect(taskStore.tasks[0].title).toBe("Old Title");
		expect(taskStore.tasks[0].text).toBe("Old text");

		taskStore.editTask(taskId, "New Title", "New text");

		expect(taskStore.tasks[0].title).toBe("New Title");
		expect(taskStore.tasks[0].text).toBe("New text");
	});

	test("should filter tasks by search query", () => {
		taskStore.addTask(null, "Important Task", "Urgent");
		taskStore.addTask(null, "Regular Task", "Normal");

		expect(taskStore.searchFilter).toBe("");
		taskStore.searchFilter = "Important";
		expect(taskStore.searchFilter).toBe("Important");

		const filteredTasks = taskStore.filteredTasks;
		expect(filteredTasks).toHaveLength(1);
		expect(filteredTasks[0].title).toBe("Important Task");
	});

	test("should save to localStorage when modifying tasks", () => {
		taskStore.addTask(null, "Test Task", "");

		expect(localStorageMock.setItem).toHaveBeenCalledWith(
			"tasks",
			JSON.stringify(taskStore.tasks)
		);
	});

	test("should load from localStorage on initialization", () => {
		const mockTasks = [
			{
				id: "loaded-id",
				title: "Loaded Task",
				text: "From storage",
				completed: false,
				collapsed: false,
				children: [],
			},
		];

		localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const store = new (taskStore.constructor as any)();

		expect(store.tasks).toEqual(mockTasks);
		expect(localStorageMock.getItem).toHaveBeenCalledWith("tasks");
	});
});
