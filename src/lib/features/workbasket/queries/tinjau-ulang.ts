import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils/api';

export const tinjauUlangQueries = {
	data: ({ noTrx, regSpaj }: { noTrx: string; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['tinjau-ulang', 'data', noTrx, regSpaj],
			queryFn: async () => {
				const { data } = await api.get(`/polaris/api-business-polaris/major/alteration/getDataReunderwriting?noTrx=${noTrx}&regSpaj=${regSpaj}`);
				return data;
			}
		});
	}
};
