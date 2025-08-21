import { useState, useEffect } from "react";

function useDarkMode() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDarkMode(mediaQuery.matches);

		const handleChange = (event: {
			matches: boolean | ((prevState: boolean) => boolean);
		}) => {
			setIsDarkMode(event.matches);
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return isDarkMode;
}

export default useDarkMode;
