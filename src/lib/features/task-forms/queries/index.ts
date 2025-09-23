import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

import * as Type from './type';

export const taskFormQueries = {
	transactionHistories: ({ trx_major, case_id, no_temp, id_doc_temp }: { trx_major: string; case_id: number; no_temp: string; id_doc_temp: string }) => {
		return queryOptions({
			queryKey: ['task-form', 'transaction-histories', trx_major, case_id, no_temp, id_doc_temp],
			queryFn: async () => {
				const { data } = await api.post<Type.TransactionHistoriesRes>('/polaris/api-business-polaris/major/alteration/viewStatusTrx', {
					trx_major,
					case_id,
					no_temp,
					id_doc_temp
				});
				return data.status_transaksi;
			}
		});
	}
};
