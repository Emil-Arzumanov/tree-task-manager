"use client";

import React, { useEffect, useState } from "react";
import { taskStore } from "@/src/store/TaskStore";
import { TaskTree } from "@/src/components/TaskTree";
import AddTask from "@/src/components/AddTask";
import { observer } from "mobx-react-lite";
import TaskFilter from "./TaskFilter";
import { SegmentedControl, Spinner } from "@radix-ui/themes";
import { ThemeModeEnum } from "../types/types";

const TaskManager = observer(() => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div className="h-full flex flex-col">
			<div className="p-4 grid grid-rows gap-1">
				<TaskFilter />
				<div className="flex justify-between">
					<AddTask />
					<SegmentedControl.Root
						defaultValue="inherit"
						radius="medium"
						value={taskStore.themeMode}
						onValueChange={(value) =>
							(taskStore.themeMode = value as ThemeModeEnum)
						}
					>
						<SegmentedControl.Item value={ThemeModeEnum.inherit}>
							Inherit
						</SegmentedControl.Item>
						<SegmentedControl.Item value={ThemeModeEnum.dark}>
							Dark
						</SegmentedControl.Item>
						<SegmentedControl.Item value={ThemeModeEnum.light}>
							Light
						</SegmentedControl.Item>
					</SegmentedControl.Root>
				</div>
			</div>
			<div className="h-full overflow-y-auto scrollbar-custom scrollbar-custom-light">
				{!isClient ? (
					<div className="h-full flex items-center justify-center">
						<Spinner size="3" />
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
