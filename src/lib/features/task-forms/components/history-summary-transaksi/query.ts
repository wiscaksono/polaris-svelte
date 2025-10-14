import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';
import type { HistorySummaryTransaksiRes } from './type';

export const historySummaryTransaksiQueries = {
	get: ({ regSpaj }: { regSpaj: string }) => {
		return queryOptions({
			queryKey: ['history-summary-transaksi', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<HistorySummaryTransaksiRes>(
					`/polaris/api-financial-polaris/v1/financial/worksheet/summaryTransaction?regSpaj=${regSpaj}`
				);
				return data;
			}
		});
	}
};
