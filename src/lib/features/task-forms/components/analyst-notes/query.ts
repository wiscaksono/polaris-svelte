import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import type { AnalystNotesRes } from './type';

export const analystNotesQueries = {
	get: ({ noTrx, caseId, trx }: { noTrx: string; caseId: string | number; trx: string }) => {
		return queryOptions({
			queryKey: ['analyst-notes', noTrx, caseId, trx],
			queryFn: async () => {
				const searchParams = new URLSearchParams();
				searchParams.set('noTrx', noTrx);
				searchParams.append('idDoc', String(caseId));
				searchParams.append('caseTrx', trx);

				const { data } = await api.get<AnalystNotesRes>(`/polaris/api-financial-polaris/v1/financial/worksheet/getAnalystNotes?${searchParams.toString()}`);
				return data;
			}
		});
	},
	update: ({ noTrx, caseId, trx }: { noTrx: string; caseId: string | number; trx: string }) => {
		return mutationOptions({
			mutationFn: async (payload: AnalystNotesRes) => {
				const searchParams = new URLSearchParams();
				searchParams.set('noTrx', noTrx);
				searchParams.append('idDoc', String(caseId));
				searchParams.append('caseTrx', trx);

				await api.post(`/polaris/api-financial-polaris/v1/financial/worksheet/AnalystNotes?${searchParams.toString()}`, payload);
			}
		});
	}
};
