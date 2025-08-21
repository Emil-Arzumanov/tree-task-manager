import { taskStore } from "@store/TaskStore";
import { Task } from "@libs/types";
import React, { useState } from "react";

interface Prop {
	taskId: Task["id"];
	taskTitle: Task["title"];
	editMode: boolean;
}

const TaskTitle = ({ taskId, taskTitle, editMode }: Prop) => {
	const [localTitle, setLocalTitle] = useState(taskTitle);
	const handleTitleChange = (value: string) => {
		setLocalTitle(value);
		taskStore.debouncedEditTask(taskId, value);
	};
	return (
		<div className="h-full">
			{editMode ? (
				<input
					className="text-xl font-bold w-full p-1 mb-2
						 border border-[var(--gray-9)] rounded-md
             focus:outline-none focus:ring-2 focus:ring-[var(--gray-12)] focus:border-transparent
             transition-all duration-200
             bg-[var(--gray-2)] text-[var(--gray-12)]"
					value={localTitle}
					onChange={(e) => handleTitleChange(e.target.value)}
				/>
			) : (
				<h1
					className="text-xl font-bold w-full p-1 mb-2 text-[var(--gray-12)]
							 overflow-y-auto max-h-40 scrollbar-custom scrollbar-custom-dark"
				>
					{taskTitle}
				</h1>
			)}
		</div>
	);
};

export default TaskTitle;
