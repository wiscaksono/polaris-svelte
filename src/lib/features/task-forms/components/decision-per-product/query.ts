import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import * as Type from './type';

export const decisionPerProductQueries = {
	get: ({ regSpaj, idDoc }: { regSpaj: string | number; idDoc: string | number }) => {
		return queryOptions({
			queryKey: ['decision-per-product', regSpaj, idDoc],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionPerProductRes>(
					`/polaris/api-business-polaris/major/alteration/decisionForm?regSpaj=${regSpaj}&idDoc=${idDoc}`
				);
				return data;
			}
		});
	},
	update: ({ idDoc, lusId, regSpaj, trxMajor }: { idDoc: string; lusId: number; regSpaj: string; trxMajor: string }) => {
		return mutationOptions({
			mutationFn: async (payload: Type.DecisionPerProductRes['listPeserta'][number]) => {
				const { data } = await api.post('/polaris/api-business-polaris/major/alteration/saveDecisionAfter', {
					payload: [{ ...payload, idDoc, lusId, regSpaj, trxMajor }]
				});
				return data;
			}
		});
	},
	listJenisAkseptasi: () => {
		return queryOptions({
			queryKey: ['decision-per-product', 'list-jenis-akseptasi'],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionPerProductListJenisAkseptasiRes>('/polaris/api-business-polaris/major/alteration/jenisAkseptasiAfter');
				return data.jenisAkseptasi;
			}
		});
	},
	listSubAkseptasi: () => {
		return queryOptions({
			queryKey: ['decision-per-product', 'list-sub-akseptasi'],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionPerProductListSubAkseptasiRes>('/polaris/api-business-polaris/major/alteration/subAkseptasiAfter');
				return data.subAkseptasi;
			}
		});
	},
	listJenisExtra: () => {
		return queryOptions({
			queryKey: ['decision-per-product', 'list-jenis-extra'],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionPerProductListJenisExtraRes>('/polaris/api-business-polaris/major/alteration/jenisExtraDecisionAfter');
				return data.jenisExtra;
			}
		});
	},
	listDiagnosis: () => {
		return queryOptions({
			queryKey: ['decision-per-product', 'list-diagnosis'],
			queryFn: async () => {
				const { data } = await api.get<Type.DecisionPerProductListDiagnosisRes>('/polaris/api-business-polaris/major/alteration/decisionDiagnosis');
				return data.diagnosisList;
			}
		});
	}
};
