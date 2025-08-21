/**
 * Утилитная функция debounce для ограничения частоты вызовов функции
 * Возвращает новую функцию, которая будет вызвана только после завершения
 * указанной задержки без новых вызовов
 *
 * @template T - Тип исходной функции
 * @param {T} func - Функция для обертывания в debounce
 * @param {number} delay - Задержка в миллисекундах
 * @returns {(...args: Parameters<T>) => void} - Функция с debounce-логикой
 *
 * @example
 * const debouncedFn = debounce((value: string) => {
 *   console.log(value);
 * }, 300);
 *
 * debouncedFn('test'); // Вызовется через 300ms если не будет новых вызовов
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout> | null = null;

	// Возвращаем новую функцию с debounce-логикой
	return function (...args: Parameters<T>) {
		// Очищаем предыдущий таймер если он существует
		if (timer) {
			clearTimeout(timer);
		}

		// Устанавливаем новый таймер для вызова функции
		timer = setTimeout(() => func(...args), delay);
	};
};
