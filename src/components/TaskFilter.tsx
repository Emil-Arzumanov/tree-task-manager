"use client";

import React, { useState } from "react";
import { taskStore } from "@store/TaskStore";
import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const TaskFilter = () => {
	const [localValue, setLocalValue] = useState(taskStore.searchFilter);

	const handleInputChange = (value: string) => {
		setLocalValue(value);
		taskStore.debouncedSetSearch(value);
	};

	return (
		<TextField.Root
			placeholder="Поиск задач..."
			value={localValue}
			onChange={(e) => handleInputChange(e.target.value)}
		>
			<TextField.Slot>
				<MagnifyingGlassIcon height="16" width="16" />
			</TextField.Slot>
		</TextField.Root>
	);
};

export default TaskFilter;
