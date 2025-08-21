"use client";

import React, { useEffect, useState } from "react";
import { taskStore } from "@store/TaskStore";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";
import { Button, Spinner } from "@radix-ui/themes";
import TaskDescription from "./TaskDescription";
import TaskTitle from "./TaskTitle";

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
		return (
			<div className="h-full flex items-center justify-center">
				Выберите задачу
			</div>
		);
	}

	const task = taskStore.findTask(id, taskStore.tasks);
	if (!task) {
		return (
			<div className="h-full flex items-center justify-center">
				Задача не найдена
			</div>
		);
	}

	return (
		<div className="p-4 grid grid-rows-[auto_1fr_auto] gap-2 h-full">
			<TaskTitle taskId={task.id} taskTitle={task.title} editMode={editMode} />
			<TaskDescription
				taskId={task.id}
				taskText={task.text}
				editMode={editMode}
			/>
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
