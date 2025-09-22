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
