import { toast } from 'svelte-sonner';
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

import type { LayoutLoad } from './$types';

export const ssr = false;

export const csr = true;

export const prerender = false;

export const load: LayoutLoad = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 60 * 1000,
				refetchOnWindowFocus: false,
				retry: false
			},
			mutations: {
				onError: (error) => {
					console.log(error);
					toast.error('Something went wrong', { description: error.message ?? 'Please try again later', position: 'bottom-center' });
				}
			}
		}
	});

	return { queryClient };
};
