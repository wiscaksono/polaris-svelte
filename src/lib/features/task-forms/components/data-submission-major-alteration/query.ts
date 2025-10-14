import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';

import type { DataSubmissionRes } from './type';

export const dataSubmissionQueries = {
	get: ({ noTrx, regSpaj }: { noTrx: string; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-submission', noTrx, regSpaj],
			queryFn: async () => {
				const { data } = await api.get<DataSubmissionRes>(
					`/polaris/api-business-polaris/major/alteration/getDataReunderwriting?noTrx=${noTrx}&regSpaj=${regSpaj}`
				);
				return data;
			}
		});
	},
	update: ({ noTrx, regSpaj }: { noTrx: string; regSpaj: string }) => {
		return mutationOptions({
			mutationFn: async (payload: DataSubmissionRes) => {
				await api.put(`/polaris/api-business-polaris/major/alteration/saveDataReunderwriting?noTrx=${noTrx}&regSpaj=${regSpaj}`, payload);
			}
		});
	}
};
