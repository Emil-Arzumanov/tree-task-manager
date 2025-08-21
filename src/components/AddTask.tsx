"use client";

import React from "react";
import { taskStore } from "@store/TaskStore";
import { observer } from "mobx-react-lite";
import { Button } from "@radix-ui/themes";

const AddTask = observer(() => {
	return (
		<Button
			color="blue"
			variant="soft"
			onClick={() => taskStore.addTask(null, "Новая задача", "")}
		>
			Добавить задачу
		</Button>
	);
});

export default AddTask;
