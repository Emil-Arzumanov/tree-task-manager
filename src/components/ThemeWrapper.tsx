"use client";

import { Spinner, Theme } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { taskStore } from "../store/TaskStore";
import { observer } from "mobx-react-lite";

interface Prop {
	children: React.ReactNode;
}

const ThemeWrapper = observer(({ children }: Prop) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Spinner size="3" />
			</div>
		);
	}

	return <Theme appearance={taskStore.themeMode}>{children}</Theme>;
});

export default ThemeWrapper;
