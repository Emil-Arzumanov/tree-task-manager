export interface Task {
	id: string;
	title: string;
	text: string;
	completed: boolean;
	collapsed: boolean;
	children: Task[];
	parentId?: string | null;
}

export enum ThemeModeEnum {
	inherit = "inherit",
	dark = "dark",
	light = "light",
}
