import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

import type { CreateMutationOptions } from '@tanstack/svelte-query';

export * from './api';
export * from './type';
export * from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function mutationOptions<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
	options: CreateMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationOptions<TData, TError, TVariables, TContext> {
	return options;
}

/**
 * Exclude keys from object
 * @param obj
 * @param keys
 */
export const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
	for (const key of keys) delete obj[key];
	return obj;
};

/**
 * Pick keys from object
 * @param obj
 * @param keys
 */
export const pick = <Type extends object, Key extends keyof Type>(obj: Type, keys: Key[]): Pick<Type, Key> => {
	const result = {} as Pick<Type, Key>;
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key];
		}
	}
	return result;
};

/**
 * Convert a string to title case.
 * @param str - The string to convert to title case.
 * @returns The string converted to title case.
 */
export function toTitleCase(str: string) {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Converts a camelCase or PascalCase identifier into Title Case words.
 * @param str - The identifier to convert (e.g., "cancelFreeLook", "parseHTTP2Response").
 * @returns The title-cased phrase with spaces between words.
 */
export function camelToTitle(str: string): string {
	const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) ?? [];
	return words.map((w) => w.slice(0, 1).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Formats a number into a currency string.
 * @param amount The number to format.
 * @param currency The ISO 4217 currency code (e.g., 'USD', 'IDR').
 * @param locale The BCP 47 language tag (e.g., 'en-US', 'id-ID').
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number, currency: string, locale: string, options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>) {
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		// You can add more options here if needed
		// minimumFractionDigits: 2,
		...options
	});

	return formatter.format(amount);
}

/**
 * Formats a number with locale-specific group separators (e.g., 1000000 -> '1.000.000' in id-ID).
 * @param number The number to format.
 * @param locale The BCP 47 language tag (e.g., 'en-US', 'id-ID').
 * @param options Additional options for Intl.NumberFormat.
 * @returns The formatted number string.
 */
export function formatNumber(number: number, locale: string, options?: Intl.NumberFormatOptions) {
	const formatter = new Intl.NumberFormat(locale, options);
	return formatter.format(number);
}

/**
 * Converts a string into a URL-friendly "slug".
 * This function handles various edge cases, including:
 * - Trimming whitespace from the start and end.
 * - Converting the string to lowercase.
 * - Replacing spaces and special characters with hyphens.
 * - Removing diacritics/accents (e.g., café -> cafe).
 * - Collapsing multiple consecutive hyphens into a single one.
 * - Removing leading and trailing hyphens.
 * - Handling empty or whitespace-only strings.
 *
 * @param text The string to convert into a slug.
 * @returns The slugified string.
 */
export function slugify(text: string | null | undefined) {
	// 1. Handle null, undefined, or empty string input
	if (!text) return '';

	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return (
		text
			.toString()
			// 2. Convert to lower case
			.toLowerCase()
			// 3. Replace special characters with their basic Latin equivalents
			.replace(p, (c) => b.charAt(a.indexOf(c)))
			// 4. Replace characters that are not word characters, digits, or hyphens with a hyphen
			.replace(/[^\w\d-]+/g, '-')
			// 5. Collapse consecutive hyphens into a single hyphen
			.replace(/-+/g, '-')
			// 6. Remove leading and trailing hyphens
			.replace(/^-+|-+$/g, '')
	);
}

/**
 * Formats a total number of seconds into a human-readable string.
 *
 * The function breaks down the total seconds into days, hours, minutes, and seconds.
 * It intelligently omits larger units that are zero. For instance, 70 seconds
 * becomes '1m 10s', not '0d 0h 1m 10s'.
 *
 * @param totalSeconds - The total number of seconds to format. Should be a non-negative number.
 * @returns A formatted time string like '1d 2h 3m 4s', '0s' if the input is 0,
 * or an error message for negative input.
 *
 * @example
 * ```typescript
 * console.log(formatTime(90061)); // "1d 1h 1m 1s"
 * console.log(formatTime(3661));  // "1h 1m 1s"
 * console.log(formatTime(65));    // "1m 5s"
 * console.log(formatTime(59));    // "59s"
 * console.log(formatTime(0));     // "0s"
 * ```
 */
export function formatDuration(totalSeconds: number): string {
	if (totalSeconds === 0) return '0s';
	if (totalSeconds < 0) return 'Invalid input: seconds cannot be negative.';

	const secondsInMinute = 60;
	const secondsInHour = 60 * secondsInMinute; // 3600
	const secondsInDay = 24 * secondsInHour; // 86400

	const days = Math.floor(totalSeconds / secondsInDay);
	let remainingSeconds = totalSeconds % secondsInDay;

	const hours = Math.floor(remainingSeconds / secondsInHour);
	remainingSeconds %= secondsInHour;

	const minutes = Math.floor(remainingSeconds / secondsInMinute);
	const seconds = remainingSeconds % secondsInMinute;

	const parts: string[] = [];

	if (days > 0) {
		parts.push(`${days}d`);
		parts.push(`${hours}h`);
		parts.push(`${minutes}m`);
		parts.push(`${seconds}s`);
	} else if (hours > 0) {
		parts.push(`${hours}h`);
		parts.push(`${minutes}m`);
		parts.push(`${seconds}s`);
	} else if (minutes > 0) {
		parts.push(`${minutes}m`);
		parts.push(`${seconds}s`);
	} else {
		parts.push(`${seconds}s`);
	}

	return parts.join(' ');
}

/**
 * Wait for a number of milliseconds.
 * @param ms - Number of milliseconds to wait.
 * @returns Promise that resolves after the given number of milliseconds.
 */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
