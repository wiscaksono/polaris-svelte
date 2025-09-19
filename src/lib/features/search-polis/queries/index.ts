import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils/api';

import type { SearchPolisListRes } from './type';

export const searchPolisQueries = {
	list: (search: string | number) => {
		return queryOptions({
			queryKey: ['search-polis', 'list', search],
			queryFn: async () => {
				const { data } = await api.get<SearchPolisListRes>(`/polaris/api-business-polaris/major/workbasket/search-polis?search=${search}`);
				return data;
			},
			enabled: () => {
				if (typeof search === 'string' && search.length > 2) return true;
				if (typeof search === 'number' && search > 0) return true;
				return false;
			},
		});
	}
};
