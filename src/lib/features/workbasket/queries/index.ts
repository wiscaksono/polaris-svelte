import { queryOptions, keepPreviousData } from '@tanstack/svelte-query';
import { api } from '$lib/utils/api';

import type * as Type from './types';
import type { PolisListRes } from '$lib/utils/type';


const cleanProps = (props: Type.WorkbasketReq) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== ''));

export const workbasketQueries = {
	newSubmissionList: (props: Type.WorkbasketReq) => {
		return queryOptions({
			queryKey: ['new-submission', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'newSubmission'>>('/polaris/api-business-polaris/major/workbasket/filterSubmission', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...cleanProps(props)
				});
				return data;
			},
			placeholderData: keepPreviousData
		});
	},

	furtherList: (props: Type.WorkbasketReq) => {
		return queryOptions({
			queryKey: ['further', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'further'>>('/polaris/api-business-polaris/major/workbasket/further', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...cleanProps(props)
				});
				return data;
			},
			placeholderData: keepPreviousData
		});
	},

	fillingList: (props: Type.WorkbasketReq) => {
		return queryOptions({
			queryKey: ['filling', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'filling'>>('/polaris/api-business-polaris/major/workbasket/filling', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...cleanProps(props)
				});
				return data;
			},
			placeholderData: keepPreviousData
		});
	},

	flaggedList: (props: Type.WorkbasketReq) => {
		return queryOptions({
			queryKey: ['flagged', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'flagged'>>('/polaris/api-business-polaris/major/workbasket/flagged', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...cleanProps(props)
				});
				return data;
			},
			placeholderData: keepPreviousData
		});
	},

	statusTrxHistory: ({ trx_major, case_id, no_temp, id_doc_temp }: { trx_major: string; case_id: number; no_temp: string; id_doc_temp: string }) => {
		return queryOptions({
			queryKey: ['common', 'status-trx-history', trx_major, case_id, no_temp, id_doc_temp],
			queryFn: async () => {
				const { data } = await api.post<Type.StatusTrxHistoryRes>('/polaris/api-business-polaris/major/alteration/viewStatusTrx', {
					trx_major,
					case_id,
					no_temp,
					id_doc_temp
				});
				return data.status_transaksi;
			}
		});
	}
};
