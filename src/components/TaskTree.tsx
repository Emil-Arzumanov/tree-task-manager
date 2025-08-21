"use client";

import { observer } from "mobx-react-lite";
import { taskStore, Task } from "@/src/store/TaskStore";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Checkbox, ChevronDownIcon } from "@radix-ui/themes";
import { PlusIcon, Cross1Icon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Props {
	tasks: Task[];
}

export const TaskTree = observer(({ tasks }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedId = searchParams.get("id");

	return (
		<ul>
			{tasks.map((task) => (
				<li
					key={task.id}
					className={`my-1 cursor-pointer border rounded-md p-2 shadow-sm ${
						selectedId === task.id ? "bg-[var(--blue-4)]" : "bg-[var(--gray-1)]"
					} border-[var(--blue-7)]`}
					onClick={(event) => {
						event.stopPropagation();
						router.push(`/?id=${task.id}`);
					}}
				>
					<div className="flex items-center justify-between gap-2">
						<div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 w-full">
							{task.children.length ? (
								<button
									className="w-5 h-5 flex items-center justify-center"
									onClick={(event) => {
										event.stopPropagation();
										taskStore.toggleCollapse(task.id);
									}}
								>
									{task.collapsed ? (
										<ChevronRightIcon className="w-5 h-5"></ChevronRightIcon>
									) : (
										<ChevronDownIcon className="w-3 h-3"></ChevronDownIcon>
									)}
								</button>
							) : (
								""
							)}
							<Checkbox
								color="blue"
								variant="soft"
								checked={task.completed}
								onCheckedChange={() => taskStore.toggleTask(task.id)}
								onClick={(event) => event.stopPropagation()}
							/>
							<span className="truncate min-w-0">{task.title}</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								color="blue"
								variant="soft"
								onClick={(event) => {
									event.stopPropagation();
									taskStore.addTask(task.id, "Новая задача", "");
								}}
							>
								<PlusIcon className="w-4 h-4"></PlusIcon>
							</Button>
							<Button
								color="red"
								variant="soft"
								onClick={(event) => {
									event.stopPropagation();
									taskStore.removeTask(task.id);
								}}
							>
								<Cross1Icon className="w-4 h-4"></Cross1Icon>
							</Button>
						</div>
					</div>
					{!task.collapsed && task.children.length > 0 && (
						<TaskTree tasks={task.children} />
					)}
				</li>
			))}
		</ul>
	);
});
