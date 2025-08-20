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
		<div className="h-full flex flex-col">
			<div className="p-4 grid grid-rows gap-1">
				<TaskFilter />
				<AddTask />
			</div>
			<div className="h-full overflow-y-auto">
				{!isClient ? (
					<div className="h-full flex items-center justify-center">
						Загрузка...
					</div>
				) : (
					<div>
						<TaskTree tasks={taskStore.filteredTasks} />
					</div>
				)}
			</div>
		</div>
	);
});

export default TaskManager;
