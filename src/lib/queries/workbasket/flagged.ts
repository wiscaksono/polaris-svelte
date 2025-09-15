import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/api';

import type { PolisListRes } from '$lib/type';

export const flaggedQueries = {
	list: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['flagged', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'flagged'>>(
					'/polaris/api-business-polaris/major/workbasket/flagged',
					{ pageSize, pageNumber }
				);
				return data;
			}
		});
	}
};
