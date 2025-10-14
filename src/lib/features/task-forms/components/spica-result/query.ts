import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';
import type { SpicaResultRes } from './type';

export const spicaQueries = {
	get: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['spica-result', noTrx],
			queryFn: async () => {
				const { data } = await api.get<SpicaResultRes>(`/polaris/api-consumer-polaris/financial/spicaResult?trxMajor=${noTrx}`);
				// const { data } = await api.get<SpicaResultRes>(`/polaris/api-consumer-polaris/financial/spicaResult?trxMajor=202510CMJR00004985`);
				return data;
			}
		});
	}
};
