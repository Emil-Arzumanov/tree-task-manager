"use client";

import React from "react";
import { taskStore } from "@/src/store/TaskStore";
import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const TaskFilter = () => {
	return (
		<TextField.Root
			placeholder="Поиск задач..."
			value={taskStore.searchFilter}
			onChange={(e) => (taskStore.searchFilter = e.target.value)}
		>
			<TextField.Slot>
				<MagnifyingGlassIcon height="16" width="16" />
			</TextField.Slot>
		</TextField.Root>
	);
};

export default TaskFilter;
