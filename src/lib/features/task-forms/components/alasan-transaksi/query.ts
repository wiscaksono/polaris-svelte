import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';
import type { AlasanTransaksiListReasonRes } from './type';

export const alasanTransaksiQueries = {
	listReason: () => {
		return queryOptions({
			queryKey: ['alasan-transaksi', 'list-reason'],
			queryFn: async () => {
				// TODO: Bind the right transaction ID
				const { data } = await api.get<AlasanTransaksiListReasonRes>(`/polaris/api-data-entry-polaris/v1/financial/reasons?transaction=3`);
				return data;
			}
		});
	}
};
