import { api } from '$lib/api';
import { queryOptions } from '@tanstack/svelte-query';

import type { DataPolisListRes } from './type';

export const dataPolisQueries = {
	list: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['data-polis', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<DataPolisListRes>(
					'/polaris/api-business-polaris/major/workbasket/dataMajor',
					{ pageSize, pageNumber }
				);
				return data;
			}
		});
	}
};
