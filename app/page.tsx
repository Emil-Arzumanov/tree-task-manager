import TaskDetails from "@/src/components/TaskDetails";
import TaskManager from "@/src/components/TaskManager";

export default function Home() {
	return (
		<div className="grid grid-cols-[1fr_1fr]">
			<div className="p-2 h-screen">
				<TaskManager />
			</div>
			<div className="p-2 flex items-center justify-center bg-neutral-300 h-screen">
				<TaskDetails />
			</div>
		</div>
	);
}
