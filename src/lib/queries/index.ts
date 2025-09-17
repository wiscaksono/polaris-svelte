import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

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
