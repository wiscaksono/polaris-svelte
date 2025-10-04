import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

import type { DataKesehatanRes } from './type';

export const dataKesehatanQueries = {
	get: ({ caseId, regSpaj }: { caseId: number; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-kesehatan', caseId, regSpaj],
			queryFn: async () => {
				const { data } = await api.post<DataKesehatanRes>('/polaris/api-business-polaris/major/alteration/data-kesehatan', { regSpaj, caseId });
				return data.data_kesehatan;
			}
		});
	},
	getWorksheet: ({ caseId, regSpaj }: { caseId: number; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-kesehatan', 'worksheet', caseId, regSpaj],
			queryFn: async () => {
				const { data } = await api.post<DataKesehatanRes>('/polaris/api-business-polaris/major/alteration/data-kesehatan-worksheet', { regSpaj, caseId });
				return data.data_kesehatan;
			}
		});
	}
};
