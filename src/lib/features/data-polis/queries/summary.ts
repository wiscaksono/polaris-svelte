import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type { DataPolisSummaryRes } from './type';

export const dataPolisSummaryQueries = {
	summary: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'summary', regSpaj],
			queryFn: async () => {
				// TODO: Tell backend to return data in a better format
				const data = (await api.get(`/api-summary-polaris/summary/list?regSpaj=${regSpaj}`)) as unknown as DataPolisSummaryRes;
				return data;
			}
		});
	},
	products: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'product', regSpaj],
			queryFn: async () => {
				// const { data } = await api.get(`/polaris/api-summary-polaris/summary/data-polis?regSpaj=${regSpaj}`);
				const { data } = await import('./dummy.json');
				return data;
			}
		});
	}
};
