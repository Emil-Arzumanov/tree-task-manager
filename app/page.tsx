import TaskDetails from "@/src/components/TaskDetails";
import TaskManager from "@/src/components/TaskManager";
import { Box } from "@radix-ui/themes";

export default function Home() {
	return (
		<div className="grid grid-cols-[1fr_1fr]">
			<div className="p-2 h-screen">
				<TaskManager />
			</div>
			<Box
				style={{ background: "var(--gray-a6)" }}
				className="p-2 bg-neutral-300 h-screen"
			>
				<TaskDetails />
			</Box>
		</div>
	);
}
