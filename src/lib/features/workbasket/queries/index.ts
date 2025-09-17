import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils/api';

import type { PolisListRes } from '$lib/utils/type';

export const workbasketQueries = {
	newSubmissionList: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['new-submission', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'newSubmission'>>('/polaris/api-business-polaris/major/workbasket/filterSubmission', {
					pageSize,
					pageNumber
				});
				return data;
			}
		});
	},

	furtherList: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['further', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'further'>>('/polaris/api-business-polaris/major/workbasket/further', { pageSize, pageNumber });
				return data;
			}
		});
	},

	fillingList: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['filling', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'filling'>>('/polaris/api-business-polaris/major/workbasket/filling', { pageSize, pageNumber });
				return data;
			}
		});
	},

	flaggedList: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['flagged', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'flagged'>>('/polaris/api-business-polaris/major/workbasket/flagged', { pageSize, pageNumber });
				return data;
			}
		});
	}
};
