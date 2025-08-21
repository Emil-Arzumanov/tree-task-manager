import { useState, useEffect } from "react";

/**
 * Кастомный хук для определения предпочтения темной темы в системе
 * Следит за изменениями системной темы и возвращает текущее состояние
 *
 * @returns {boolean} true если система использует темную тему, false если светлую
 */
function useDarkMode() {
	// Состояние для хранения текущего режима темы
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Создаем MediaQueryList для отслеживания системной темы
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Устанавливаем начальное значение на основе текущих системных настроек
		setIsDarkMode(mediaQuery.matches);

		// Обработчик изменений системной темы
		const handleChange = (event: {
			matches: boolean | ((prevState: boolean) => boolean);
		}) => {
			setIsDarkMode(event.matches);
		};

		// Подписываемся на изменения системной темы
		mediaQuery.addEventListener("change", handleChange);

		// Отписываемся от событий при размонтировании компонента
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []); // Пустой массив зависимостей - эффект выполняется только при монтировании

	return isDarkMode;
}

export default useDarkMode;
