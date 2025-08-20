"use client";

import React from "react";
import { taskStore } from "@/src/store/TaskStore";
import { observer } from "mobx-react-lite";

const AddTask = observer(() => {
	return (
		<button
			className="mb-2 p-1 border rounded"
			onClick={() => taskStore.addTask(null, "Новая задача", "")}
		>
			Добавить задачу
		</button>
	);
});

export default AddTask;
