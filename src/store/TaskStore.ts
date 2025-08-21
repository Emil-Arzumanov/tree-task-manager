"use client";

import { makeAutoObservable } from "mobx";
import { Task, ThemeModeEnum } from "@libs/types";
import { debounce } from "@utils/basicUtils";

const DEBOUNCE_DELAY = 500;

/**
 * Главный store для управления задачами и состоянием приложения
 * Содержит бизнес-логику для работы с древовидной структурой задач,
 * фильтрации, темой оформления и синхронизации с localStorage
 */
class TaskStore {
	// Массив корневых задач (родительские задачи верхнего уровня)
	tasks: Task[] = [];

	// Текущий поисковый запрос для фильтрации задач
	searchFilter: string = "";

	// Текущая тема оформления приложения
	themeMode: ThemeModeEnum = ThemeModeEnum.inherit;

	constructor() {
		makeAutoObservable(this);
		this.loadFromLocalStorage(); // Загружаем данные из localStorage при инициализации
	}

	// Debounce-версия установки поискового фильтра (для оптимизации)
	debouncedSetSearch = debounce((filter: string) => {
		this.searchFilter = filter;
	}, DEBOUNCE_DELAY);

	/**
	 * Переключает тему оформления приложения
	 * @param themeMode - новая тема оформления
	 */
	toggleDarkMode(themeMode: ThemeModeEnum) {
		this.themeMode = themeMode;
	}

	/**
	 * Геттер для получения отфильтрованных задач
	 * Возвращает задачи, соответствующие поисковому запросу, с сохранением иерархии
	 */
	get filteredTasks(): Task[] {
		if (!this.searchFilter.trim()) return this.tasks;
		const searchValue = this.searchFilter.toLowerCase();

		/**
		 * Рекурсивная функция для фильтрации задач с сохранением иерархии
		 * Если задача или любой из её потомков соответствует запросу, она включается в результат
		 */
		const filterRecursive = (tasks: Task[]): Task[] => {
			return tasks
				.map((task) => {
					const children = filterRecursive(task.children);
					if (
						task.title.toLowerCase().includes(searchValue) ||
						children.length > 0
					) {
						return { ...task, children };
					}
					return null;
				})
				.filter(Boolean) as Task[];
		};

		return filterRecursive(this.tasks);
	}

	/**
	 * Добавляет новую задачу
	 * @param parentId - ID родительской задачи (null для корневой задачи)
	 * @param title - заголовок задачи
	 * @param text - описание задачи
	 */
	addTask(parentId: string | null, title: string, text: string) {
		const newTask: Task = {
			id: crypto.randomUUID(), // Генерируем уникальный ID
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

	/**
	 * Удаляет задачу по ID (включая всех потомков)
	 * @param id - ID задачи для удаления
	 */
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

	/**
	 * Переключает статус выполнения задачи
	 * @param id - ID задачи
	 * @param completed - опционально: явно установить статус
	 */
	toggleTask(id: string, completed?: boolean) {
		const task = this.findTask(id, this.tasks);
		if (!task) return;

		const newCompletionState = completed ?? !task.completed;

		// Рекурсивно обновляем статус выполнения для всех потомков
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
		this.updateParentCompletion(task.parentId); // Обновляем статус родительских задач
		this.saveToLocalStorage();
	}

	/**
	 * Рекурсивно обновляет статус выполнения родительских задач
	 * Родительская задача считается выполненной, если все её потомки выполнены
	 */
	updateParentCompletion(parentId?: string | null) {
		if (!parentId) return;
		const parent = this.findTask(parentId, this.tasks);
		if (!parent) return;

		parent.completed = parent.children.every((c) => c.completed);
		this.updateParentCompletion(parent.parentId);
	}

	/**
	 * Переключает состояние свернутости задачи (показ/скрытие потомков)
	 * @param id - ID задачи
	 */
	toggleCollapse(id: string) {
		const task = this.findTask(id, this.tasks);
		if (task) {
			task.collapsed = !task.collapsed;
			this.saveToLocalStorage();
		}
	}

	/**
	 * Редактирует заголовок и/или описание задачи
	 * @param id - ID задачи
	 * @param title - новый заголовок (опционально)
	 * @param text - новое описание (опционально)
	 */
	editTask(id: string, title?: string, text?: string) {
		const task = this.findTask(id, this.tasks);
		if (task) {
			if (title !== undefined) task.title = title;
			if (text !== undefined) task.text = text;
			this.saveToLocalStorage();
		}
	}

	// Debounce-версия редактирования задачи (для оптимизации частых изменений)
	debouncedEditTask = debounce((id: string, title?: string, text?: string) => {
		this.editTask(id, title, text);
	}, DEBOUNCE_DELAY);

	/**
	 * Рекурсивно ищет задачу по ID в дереве задач
	 * @param id - ID искомой задачи
	 * @param tasks - массив задач для поиска
	 * @returns Найденная задача или null
	 */
	findTask(id: string, tasks: Task[]): Task | null {
		for (const task of tasks) {
			if (task.id === id) return task;
			const foundTask = this.findTask(id, task.children);
			if (foundTask) return foundTask;
		}
		return null;
	}

	// Сохраняет задачи в localStorage
	saveToLocalStorage() {
		if (typeof window !== "undefined") {
			localStorage.setItem("tasks", JSON.stringify(this.tasks));
		}
	}

	// Загружает задачи из localStorage
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
