import type { CreateMutationOptions } from '@tanstack/svelte-query';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './api';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function mutationOptions<
	TData = unknown,
	TError = unknown,
	TVariables = void,
	TContext = unknown
>(
	options: CreateMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationOptions<TData, TError, TVariables, TContext> {
	return options;
}
