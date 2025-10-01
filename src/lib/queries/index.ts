import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

import * as Type from './type';

export * from './address';

export const commonQueries = {
	allSelect: () => {
		return queryOptions({
			queryKey: ['common', 'all-select'],
			queryFn: async () => {
				const { data } = await api.get<Type.ListAllSelectRes>('/polaris/api-business-polaris/major/entry/list-all-select');
				return data.list_all;
			}
		});
	},
	listTransaction: () => {
		return queryOptions({
			queryKey: ['common', 'list-transaction'],
			queryFn: async () => {
				const { data } = await api.get<Type.ListJenisTRXRes>('/polaris/api-business-polaris/major/alteration/viewJenisTrx');
				return data.jenis_transaksi;
			}
		});
	},
	listUser: () => {
		return queryOptions({
			queryKey: ['common', 'list-user'],
			queryFn: async () => {
				const { data } = await api.get<Type.ListUserRes>('/polaris/api-business-polaris/major/alteration/viewUserAssign');
				return data.user_assign;
			}
		});
	}
};
