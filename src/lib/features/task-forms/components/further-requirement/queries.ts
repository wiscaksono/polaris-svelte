import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';

import * as Type from './type';

export const furtherRequirementQueries = {
	get: ({ regSpaj, caseId }: { regSpaj: string | number; caseId: string | number }) => {
		return queryOptions({
			queryKey: ['further-requirement', regSpaj, caseId],
			queryFn: async () => {
				const { data } = await api.get<Type.FurtherRequirementRes>(
					`/polaris/api-business-polaris/major/alteration/trxFurther?regSpaj=${regSpaj}&idDoc=${caseId}`
				);
				return data.listFurtherTrx;
			}
		});
	},
	create: () => {
		return mutationOptions({
			mutationFn: async ({
				regSpaj,
				lusId,
				caseId,
				subMenuFurther
			}: {
				regSpaj: string;
				lusId: number;
				caseId: number;
				subMenuFurther: Array<Type.FurtherRequirementSubMenuListRes['detailFurtherList'][number] & { remarks: string }>;
			}) => {
				await api.post('/polaris/api-business-polaris/major/alteration/further', {
					listFurther: subMenuFurther.map((item) => ({
						detId: item.det_id,
						flagAction: 1,
						idDoc: caseId,
						kategori: item.lsad_desc,
						lusId,
						regSpaj,
						remarks: item.remarks,
						statusFurther: 'PENDING',
						subId: item.sub_id
					}))
				});
			}
		});
	},
	deleteOrUpdate: (action: 'delete' | 'update') => {
		return mutationOptions({
			mutationFn: async ({
				regSpaj,
				lusId,
				caseId,
				subMenuFurther
			}: {
				regSpaj: string;
				lusId: number;
				caseId: number;
				subMenuFurther: Type.FurtherRequirementRes['listFurtherTrx'][number];
			}) => {
				await api.post('/polaris/api-business-polaris/major/alteration/further', {
					listFurther: [
						{
							...subMenuFurther,
							filename: null,
							idDoc: caseId,
							lusId,
							flagAction: action === 'delete' ? 3 : 2,
							regSpaj
						}
					]
				});
			}
		});
	},
	listMenuFurther: () => {
		return queryOptions({
			queryKey: ['further-requirement', 'list-menu-further'],
			queryFn: async () => {
				const { data } = await api.get<Type.FurtherRequirementMenuListRes>('/polaris/api-business-polaris/major/alteration/addFurtherList');
				return data.listFurther;
			}
		});
	},
	listSubMenuFurther: (subId: number | string) => {
		return queryOptions({
			queryKey: ['further-requirement', 'list-sub-menu-further', subId],
			queryFn: async () => {
				const { data } = await api.get<Type.FurtherRequirementSubMenuListRes>(
					`/polaris/api-business-polaris/major/alteration/furtherDetailList?subId=${subId}`
				);
				return data.detailFurtherList;
			}
		});
	}
};

export const formSPMQueries = {
	get: ({ regSpaj, caseId }: { regSpaj: string | number; caseId: string | number }) => {
		return queryOptions({
			queryKey: ['form-spm', regSpaj, caseId],
			queryFn: async () => {
				const { data } = await api.get<Type.FormSPMRes>(`/polaris/api-business-polaris/major/alteration/trxSpm?regSpaj=${regSpaj}&noTrx=${caseId}`);
				return data.trxSpm;
			}
		});
	},
	crud: (action: 'create' | 'update' | 'delete') => {
		return mutationOptions({
			mutationFn: async ({ payload, initialData }: { payload: Type.FormSPMRes['trxSpm'][number]; initialData: Type.FormSPMRes['trxSpm'] }) => {
				const flagAction = { create: 1, update: 2, delete: 3 } as const;
				const { data } = await api.post('/polaris/api-business-polaris/major/alteration/spm', {
					spm: [...initialData, { ...payload, flagAction: flagAction[action] }]
				});
				return data;
			}
		});
	},
	listMedisUntuk: ({ regSpaj, caseId }: { regSpaj: string | number; caseId: string | number }) => {
		return queryOptions({
			queryKey: ['form-spm', 'list-medis-untuk', regSpaj, caseId],
			queryFn: async () => {
				const { data } = await api.get<Type.FormSPMListMedisUntukRes>(
					`/polaris/api-business-polaris/major/alteration/akseptasiGetSPM?regSpaj=${regSpaj}&idDoc=${caseId}`
				);
				return data.datalist_spm;
			}
		});
	},
	listMedis: () => {
		return queryOptions({
			queryKey: ['form-spm', 'list-medis'],
			queryFn: async () => {
				const { data } = await api.get<Type.FormSPMListMedisRes>('/polaris/api-business-polaris/major/alteration/akseptasiGetTipeMedis');
				return data.data;
			}
		});
	},
	listMedisAdditional: () => {
		return queryOptions({
			queryKey: ['form-spm', 'list-medis-additional'],
			queryFn: async () => {
				const { data } = await api.get<Type.FormSPMListMedisAdditionalRes>('/polaris/api-business-polaris/major/alteration/akseptasiGetMedisTambahan');
				return data.detail_tambahan;
			}
		});
	},
	detailMedis: (tipeMedis?: string | null) => {
		return queryOptions({
			queryKey: ['form-spm', 'detail-list-medis', tipeMedis],
			queryFn: async () => {
				if (tipeMedis === '' || !tipeMedis) return ['Tidak ada data'];
				const { data } = await api.get<Type.FormSPMDetailTipeMedisRes>(
					`/polaris/api-business-polaris/major/alteration/akseptasiGetDetailTipeMedis?tipeMedis=${encodeURIComponent(tipeMedis)}`
				);
				return data.detail_medis;
			}
		});
	}
};
