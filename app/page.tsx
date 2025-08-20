import TaskDetails from "@/src/components/TaskDetails";
import TaskManager from "@/src/components/TaskManager";

export default function Home() {
	return (
		<div className="grid grid-cols-[1fr_2fr] h-screen">
			<div className="border-r p-2 overflow-y-auto">
				<TaskManager />
			</div>
			<div className="p-2 flex items-center justify-center text-gray-500">
				<TaskDetails />
			</div>
		</div>
	);
}
