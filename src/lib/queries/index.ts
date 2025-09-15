import { api } from '$lib/api';
import { queryOptions } from '@tanstack/svelte-query';

export * from './login';
export * from './workbasket';
export * from './data-polis';

export const searchPolisQuery = (search = '') => {
	return queryOptions({
		queryKey: ['search-polis', search],
		queryFn: async () => {
			const { data } = await api.get(`/polaris/api-business-polaris/major/workbasket/search-polis?search=${search}`);
			return data;
		},
		enabled: !!search
	});
};
