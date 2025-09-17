import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils/api';

import type { PolisListRes } from '$lib/utils/type';

interface WorkbasketCommonParams {
	pageSize?: number;
	pageNumber?: number
	caseId?: string;
}

export const workbasketQueries = {
	newSubmissionList: (props: WorkbasketCommonParams) => {
		return queryOptions({
			queryKey: ['new-submission', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'newSubmission'>>('/polaris/api-business-polaris/major/workbasket/filterSubmission', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...props
				});
				return data;
			}
		});
	},

	furtherList: (props: WorkbasketCommonParams) => {
		return queryOptions({
			queryKey: ['further', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'further'>>('/polaris/api-business-polaris/major/workbasket/further', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...props
				});
				return data;
			}
		});
	},

	fillingList: (props: WorkbasketCommonParams) => {
		return queryOptions({
			queryKey: ['filling', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'filling'>>('/polaris/api-business-polaris/major/workbasket/filling', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...props
				});
				return data;
			}
		});
	},

	flaggedList: (props: WorkbasketCommonParams) => {
		return queryOptions({
			queryKey: ['flagged', 'list', props],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'flagged'>>('/polaris/api-business-polaris/major/workbasket/flagged', {
					pageSize: props.pageSize ?? 10,
					pageNumber: props.pageNumber ?? 1,
					...props
				});
				return data;
			}
		});
	},
};
