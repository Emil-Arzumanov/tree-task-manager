"use client";

import { Spinner, Theme } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { taskStore } from "@store/TaskStore";
import { observer } from "mobx-react-lite";
import { ThemeModeEnum } from "@libs/types";
import useDarkMode from "@hooks/useDarkMode";

interface Prop {
	children: React.ReactNode;
}

/**
 * Компонент-обертка для управления темой приложения
 * Определяет текущую тему на основе пользовательских настроек и системных предпочтений
 */
const ThemeWrapper = observer(({ children }: Prop) => {
	const isDarkMode = useDarkMode();
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Ожидаем завершения hydration перед рендерингом
	if (!isClient) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Spinner size="3" />
			</div>
		);
	}

	let theme: ThemeModeEnum = taskStore.themeMode;

	// Логика наследования темы от системы
	if (taskStore.themeMode === ThemeModeEnum.inherit && isDarkMode) {
		theme = ThemeModeEnum.dark; // Системная темная тема
	} else if (taskStore.themeMode === ThemeModeEnum.inherit) {
		theme = ThemeModeEnum.light; // Системная светлая тема
	}

	// Применяем выбранную тему через Radix UI Theme провайдер
	return <Theme appearance={theme}>{children}</Theme>;
});

export default ThemeWrapper;
