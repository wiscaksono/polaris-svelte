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
	if (!text) return "";


	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
	const p = new RegExp(a.split('').join('|'), 'g')

	return text.toString()
		// 2. Convert to lower case
		.toLowerCase()
		// 3. Replace special characters with their basic Latin equivalents
		.replace(p, c => b.charAt(a.indexOf(c)))
		// 4. Replace characters that are not word characters, digits, or hyphens with a hyphen
		.replace(/[^\w\d-]+/g, '-')
		// 5. Collapse consecutive hyphens into a single hyphen
		.replace(/-+/g, '-')
		// 6. Remove leading and trailing hyphens
		.replace(/^-+|-+$/g, '');
};
