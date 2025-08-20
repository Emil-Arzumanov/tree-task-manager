"use client";

import { observer } from "mobx-react-lite";
import { taskStore, Task } from "@/src/store/TaskStore";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
	tasks: Task[];
}

export const TaskTree = observer(({ tasks }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedId = searchParams.get("id");

	return (
		<ul className="ml-4">
			{tasks.map((task) => (
				<li key={task.id} className="my-1">
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={task.completed}
							onChange={() => taskStore.toggleTask(task.id)}
						/>
						<span
							onClick={() => router.push(`/?id=${task.id}`)}
							className={`cursor-pointer hover:underline ${
								selectedId === task.id ? "font-bold" : ""
							}`}
						>
							{task.title}
						</span>
						<button onClick={() => taskStore.toggleCollapse(task.id)}>
							{task.collapsed ? "▶" : "▼"}
						</button>
						<button
							onClick={() => taskStore.addTask(task.id, "Новая задача", "")}
						>
							➕
						</button>
						<button onClick={() => taskStore.removeTask(task.id)}>❌</button>
					</div>
					{!task.collapsed && task.children.length > 0 && (
						<TaskTree tasks={task.children} />
					)}
				</li>
			))}
		</ul>
	);
});
