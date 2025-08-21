import { taskStore } from "@store/TaskStore";
import { Task } from "@libs/types";
import React, { useState } from "react";

interface Prop {
	taskId: Task["id"];
	taskText: Task["text"];
	editMode: boolean;
}

const TaskDescription = ({ taskId, taskText, editMode }: Prop) => {
	const [localDescription, setLocalDescription] = useState(taskText);
	const handleDescriptionChange = (value: string) => {
		setLocalDescription(value);
		taskStore.debouncedEditTask(taskId, undefined, value);
	};
	return (
		<div
			className={`h-full ${
				editMode ? "" : "overflow-y-auto scrollbar-custom scrollbar-custom-dark"
			}`}
		>
			{editMode ? (
				<textarea
					className="w-full h-full p-2 resize-none scrollbar-custom scrollbar-custom-dark
             border border-[var(--gray-9)] rounded-md
             focus:outline-none focus:ring-2 focus:ring-[var(--gray-12)] focus:border-transparent
             transition-all duration-200
             bg-[var(--gray-2)] text-[var(--gray-12)]"
					value={localDescription}
					onChange={(e) => handleDescriptionChange(e.target.value)}
				/>
			) : (
				<p className="w-full p-2 text-[var(--gray-12)]">{taskText}</p>
			)}
		</div>
	);
};

export default TaskDescription;
