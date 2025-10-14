import { api, mutationOptions } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';
import * as Type from './type';

export const decisionFinalMajorAlterationQueries = {
	get: ({ idDoc }: { idDoc: string | number }) => {
		return queryOptions({
			queryKey: ['decision-final-major-alteration', idDoc],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionFinalMajorAlterationRes>(`/polaris/api-business-polaris/major/alteration/getDecisionFinal?docId=${idDoc}`);
				return data;
			}
		});
	},
	listDecision: () => {
		return queryOptions({
			queryKey: ['decision-final-major-alteration', 'list-decision'],
			queryFn: async () => {
				const data = await api.get('/polaris/api-business-polaris/major/alteration/selectDecisionFinalMajor');
				return data as unknown as Type.DecisionFinalMajorAlterationListDecisionRes;
			}
		});
	},
	update: () => {
		return mutationOptions({
			mutationFn: async (payload: Type.DecisionFinalMajorAlterationUpdateReq) => {
				await api.post('/polaris/api-business-polaris/major/alteration/insertDecisionFinalMajor', payload);
			}
		});
	}
};
