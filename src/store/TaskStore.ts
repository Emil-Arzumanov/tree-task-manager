"use client";

import { makeAutoObservable } from "mobx";

export interface Task {
	id: string;
	title: string;
	text: string;
	completed: boolean;
	collapsed: boolean;
	children: Task[];
	parentId?: string | null;
}

class TaskStore {
	tasks: Task[] = [];

	constructor() {
		makeAutoObservable(this);
		this.loadFromLocalStorage();
	}

	addTask(parentId: string | null, title: string, text: string) {
		const newTask: Task = {
			id: crypto.randomUUID(),
			title,
			text,
			completed: false,
			collapsed: false,
			children: [],
			parentId,
		};

		if (parentId) {
			const parent = this.findTask(parentId, this.tasks);
			parent?.children.push(newTask);
		} else {
			this.tasks.push(newTask);
		}
		this.saveToLocalStorage();
	}

	removeTask(id: string) {
		const remove = (tasks: Task[]) =>
			tasks.filter((task) => {
				if (task.id === id) return false;
				task.children = remove(task.children);
				return true;
			});

		this.tasks = remove(this.tasks);
		this.saveToLocalStorage();
	}

	toggleTask(id: string, completed?: boolean) {
		const task = this.findTask(id, this.tasks);
		if (!task) return;

		const newCompletionState = completed ?? !task.completed;

		const toggleCompletionRecursive = (
			task: Task,
			completionState: boolean
		) => {
			task.completed = completionState;
			task.children.forEach((childTask) =>
				toggleCompletionRecursive(childTask, completionState)
			);
		};

		toggleCompletionRecursive(task, newCompletionState);
		this.updateParentCompletion(task.parentId);
		this.saveToLocalStorage();
	}

	updateParentCompletion(parentId?: string | null) {
		if (!parentId) return;
		const parent = this.findTask(parentId, this.tasks);
		if (!parent) return;

		parent.completed = parent.children.every((c) => c.completed);
		this.updateParentCompletion(parent.parentId);
	}

	toggleCollapse(id: string) {
		const task = this.findTask(id, this.tasks);
		if (task) {
			task.collapsed = !task.collapsed;
			this.saveToLocalStorage();
		}
	}

	editTask(id: string, title?: string, text?: string) {
		const task = this.findTask(id, this.tasks);
		if (task) {
			if (title !== undefined) task.title = title;
			if (text !== undefined) task.text = text;
			this.saveToLocalStorage();
		}
	}

	findTask(id: string, tasks: Task[]): Task | null {
		for (const task of tasks) {
			if (task.id === id) return task;
			const foundTask = this.findTask(id, task.children);
			if (foundTask) return foundTask;
		}
		return null;
	}

	saveToLocalStorage() {
		if (typeof window !== "undefined") {
			localStorage.setItem("tasks", JSON.stringify(this.tasks));
		}
	}

	loadFromLocalStorage() {
		if (typeof window !== "undefined") {
			const data = localStorage.getItem("tasks");
			if (data) {
				this.tasks = JSON.parse(data);
			}
		}
	}
}

export const taskStore = new TaskStore();
