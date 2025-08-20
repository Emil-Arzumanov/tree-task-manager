"use client";

import React, { useEffect, useState } from "react";
import { taskStore } from "@/src/store/TaskStore";
import { TaskTree } from "@/src/components/TaskTree";
import AddTask from "@/src/components/AddTask";
import { observer } from "mobx-react-lite";
import TaskFilter from "./TaskFilter";

const TaskManager = observer(() => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			<AddTask />
			{!isClient ? (
				<div className="h-screen flex items-center justify-center">
					Загрузка...
				</div>
			) : (
				<TaskTree tasks={taskStore.tasks} />
			)}
		</>
	);
});

export default TaskManager;
