"use client";

import React, { useEffect, useState } from "react";
import { taskStore } from "@/src/store/TaskStore";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";

const TaskDetails = observer(() => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	const searchParams = useSearchParams();

	if (!isClient) {
		return (
			<div className="h-screen flex items-center justify-center">
				Загрузка...
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
		<div className="p-4">
			<input
				className="text-xl font-bold w-full border p-1 mb-2"
				value={task.title}
				onChange={(e) => taskStore.editTask(task.id, e.target.value)}
			/>
			<textarea
				className="w-full border p-1 h-40"
				value={task.text}
				onChange={(e) => taskStore.editTask(task.id, undefined, e.target.value)}
			/>
		</div>
	);
});

export default TaskDetails;
