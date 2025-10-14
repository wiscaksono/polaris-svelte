import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';
import type { DataInvestasiPolisRes } from './type';

export const dataInvestasiPolisQueries = {
	get: ({ regSpaj }: { regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-investasi-polis', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<DataInvestasiPolisRes>(`/polaris/api-financial-polaris/financial/getDataInvestasi?regSpaj=${regSpaj}`);
				return data;
			}
		});
	}
};
