import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

import * as Type from './type';

export const commonQuery = {
	allSelect: () => {
		return queryOptions({
			queryKey: ['common', 'all-select'],
			queryFn: async () => {
				const { data } = await api.get<Type.ListAllSelectRes>('/polaris/api-business-polaris/major/entry/list-all-select');
				return data.list_all;
			}
		});
	}
};
