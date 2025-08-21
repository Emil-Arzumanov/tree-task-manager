"use client";

import React, { use, useEffect, useState } from "react";
import { taskStore } from "@/src/store/TaskStore";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";
import { Button, Spinner } from "@radix-ui/themes";

const TaskDetails = observer(() => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	const searchParams = useSearchParams();

	const [editMode, setEditMode] = useState(false);

	if (!isClient) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Spinner size="3" />
			</div>
		);
	}

	const id = searchParams.get("id");
	if (!id) {
		return <div className="p-4">Выберите задачу</div>;
	}

	const task = taskStore.findTask(id, taskStore.tasks);
	if (!task) {
		return <div className="p-4">Задача не найдена</div>;
	}

	return (
		<div className="p-4 grid grid-rows-[auto_1fr_auto] gap-2 h-full">
			<div className="h-full">
				{editMode ? (
					<input
						className="text-xl font-bold w-full p-1 mb-2
						 border border-[var(--gray-9)] rounded-md
             focus:outline-none focus:ring-2 focus:ring-[var(--gray-12)] focus:border-transparent
             transition-all duration-200
             bg-[var(--gray-2)] text-[var(--gray-12)]"
						value={task.title}
						onChange={(e) => taskStore.editTask(task.id, e.target.value)}
					/>
				) : (
					<h1
						className="text-xl font-bold w-full p-1 mb-2 text-[var(--gray-12)]
							 overflow-y-auto max-h-40 scrollbar-custom scrollbar-custom-dark"
					>
						{task.title}
					</h1>
				)}
			</div>
			<div
				className={`h-full ${
					editMode
						? ""
						: "overflow-y-auto scrollbar-custom scrollbar-custom-dark"
				}`}
			>
				{editMode ? (
					<textarea
						className="w-full h-full p-2 resize-none scrollbar-custom scrollbar-custom-dark
             border border-[var(--gray-9)] rounded-md
             focus:outline-none focus:ring-2 focus:ring-[var(--gray-12)] focus:border-transparent
             transition-all duration-200
             bg-[var(--gray-2)] text-[var(--gray-12)]"
						value={task.text}
						onChange={(e) =>
							taskStore.editTask(task.id, undefined, e.target.value)
						}
					/>
				) : (
					<p className="w-full p-2 text-[var(--gray-12)]">{task.text}</p>
				)}
			</div>
			<div className="w-full flex justify-end">
				{editMode ? (
					<Button
						color="gray"
						variant="solid"
						onClick={() => setEditMode(false)}
					>
						Смотреть
					</Button>
				) : (
					<Button
						color="gray"
						variant="solid"
						onClick={() => setEditMode(true)}
					>
						Редактировать
					</Button>
				)}
			</div>
		</div>
	);
});

export default TaskDetails;
