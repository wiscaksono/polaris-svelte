import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type { DataPolisListRes } from './type';

export * from './summary';

export const dataPolisQueries = {
	list: ({ pageSize = 10, pageNumber = 1, noPolis }: { pageSize?: number; pageNumber?: number; noPolis?: string }) => {
		return queryOptions({
			queryKey: ['data-polis', 'list', pageSize, pageNumber, noPolis],
			queryFn: async () => {
				const { data } = await api.post<DataPolisListRes>('/polaris/api-business-polaris/major/workbasket/dataMajor', { pageSize, pageNumber, noPolis });
				return data;
			}
		});
	}
};
