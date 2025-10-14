import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

export const taskFormQueries = {
	checkIsReUnderwriting: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['task-form', 'check-is-re-underwriting', noTrx],
			queryFn: async () => {
				const { data } = await api.get<boolean>(`/polaris/api-business-polaris/major/alteration/checkReunderwriting?noTrx=${noTrx}`);
				return data;
			}
		});
	}
};
