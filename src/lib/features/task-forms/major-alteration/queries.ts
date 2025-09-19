import { queryOptions, useQueryClient } from '@tanstack/svelte-query';

import { getTaskFormContext } from '../context';
import { api, mutationOptions } from '$lib/utils';

import * as Types from './type';

export const majorAlterationQueries = {
	tab1: () => {
		const { taskFormParams } = getTaskFormContext()

		return queryOptions({
			queryKey: ['major-alteration', 'tab-1', taskFormParams.no_trx, taskFormParams.reg_spaj],
			queryFn: async () => {
				const { data } = await api.get(`/polaris/api-business-polaris/major/alteration/getDataReunderwriting?noTrx=${taskFormParams.no_trx}&regSpaj=${taskFormParams.reg_spaj}`);
				return data;
			}
		});
	},
	tab2: () => {
		const { taskFormParams } = getTaskFormContext()

		return queryOptions({
			queryKey: ['major-alteration', 'tab-2', taskFormParams.case_id, taskFormParams.reg_spaj],
			queryFn: async () => {
				const { data } = await api.get<Types.MajorAlterationTab2Res>(`/polaris/api-business-polaris/major/alteration/data-pp-dan-tu?caseId=${taskFormParams.case_id}&regSpaj=${taskFormParams.reg_spaj}`);
				return data;
			}
		});
	}
};

export const majorAlterationMutations = {
	tab1: () => { },

	tab2: () => {
		const queryClient = useQueryClient();
		const tab2Query = majorAlterationQueries.tab2();

		return mutationOptions({
			mutationFn: async (payload: Types.MajorAlterationTab2Payload) => await api.post(`/polaris/api-business-polaris/major/new-sub/data-pp-dan-tu`, payload),
			onSuccess: async () => await queryClient.invalidateQueries({ queryKey: tab2Query.queryKey })
		})
	}
}
