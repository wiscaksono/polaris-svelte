import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import type * as Type from './type';

export const dataPertanggunganQueries = {
	get: ({ caseId, regSpaj, noTmp }: { caseId: number; regSpaj: string; noTmp: string }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', caseId, regSpaj, noTmp],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganRes>(
					`/polaris/api-business-polaris/major/alteration/data-pertanggungan?noTmp=${noTmp}&caseId=${caseId}&regSpaj=${regSpaj}`
				);
				return data;
			}
		});
	},
	update: () => {
		return mutationOptions({
			mutationFn: async (payload: Type.DataPertanggunganRes) => {
				await api.post('/polaris/api-business-polaris/major/alteration/data-pertanggungan-save', payload);
			}
		});
	},
	listProduct: ({ regSpaj }: { regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-product', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListProductRes>(
					`/polaris/api-business-polaris/major/entry/list-product-asuransi-dasar/${regSpaj}`
				);
				return data.list_product_manfaat_basic;
			}
		});
	},
	listProductNew: ({ regSpaj }: { regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-product-new', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListProductNewRes>(`/polaris/api-business-polaris/major/entry/list-product-new/${regSpaj}`);
				return data.list_product;
			}
		});
	},
	listSubProductMAT: ({ regSpaj, riderId }: { regSpaj: string; riderId: number }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-sub-product-mat', regSpaj, riderId],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListSubProductMATRes>(
					`/polaris/api-business-polaris/major/entry/list-sub-produk/${regSpaj}/${riderId}`
				);
				return data.list_subproduct;
			},
			// Our backend is fill with many idiots, so we need to filter out duplicates
			select: (data) => {
				const seen = new Set<string>();

				const uniqueList = data.filter((item) => {
					const isDuplicate = seen.has(item.lsdbs_name);
					seen.add(item.lsdbs_name);
					return !isDuplicate;
				});

				return uniqueList;
			}
		});
	},
	listSubProductMAD: ({ regSpaj, riderId, repricing }: { regSpaj: string; riderId: number; repricing: number }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-sub-product-mat', regSpaj, riderId, repricing],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListSubProductMADRes>(
					`/polaris/api-business-polaris/major/entry/list-subproduct-mad/${regSpaj}/${riderId}/${repricing}`
				);
				return data.list_subproduct_manfaat_basic;
			}
		});
	},
	listTertanggung: ({
		noTmp,
		regSpaj,
		riderId,
		riderNumber,
		flagPP,
		flagTU,
		flagTT
	}: {
		noTmp: string;
		regSpaj: string;
		riderId: number;
		riderNumber: number;
		flagPP: number;
		flagTU: number;
		flagTT: number;
	}) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-tertanggung', noTmp, regSpaj, riderId, riderNumber, flagPP, flagTU, flagTT],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListTertanggungRes>(
					`/polaris/api-business-polaris/major/entry/list-tertanggung/${noTmp}/${regSpaj}/${riderId}/${riderNumber}/${flagPP}/${flagTU}/${flagTT}`
				);
				return data.list_tertanggung;
			}
		});
	},
	listWaiverDuration: ({ riderId, productId }: { riderId: number; productId: number }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-waiver', riderId, productId],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListWaiverDurationRes>(
					`/polaris/api-business-polaris/major/entry/list-waiver/${riderId}/${productId}`
				);
				return data.list_waiver;
			}
		});
	},
	listUnit: ({ riderId }: { riderId: number }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-unit', riderId],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListUnitRes>(`/polaris/api-business-polaris/major/entry/get-unit/${riderId}`);
				return data.list_unit;
			}
		});
	},
	listClass: ({ riderId }: { riderId: number }) => {
		return queryOptions({
			queryKey: ['data-pertanggungan', 'list-class', riderId],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPertanggunganListClassRes>(`/polaris/api-business-polaris/major/entry/get-class/${riderId}`);
				return data.list_class;
			}
		});
	}
};
