import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/api';

import type { PolisListRes } from '$lib/type';

export const newSubmissionQueries = {
	list: ({ pageSize = 10, pageNumber = 1 }: { pageSize?: number; pageNumber?: number }) => {
		return queryOptions({
			queryKey: ['new-submission', 'list', pageSize, pageNumber],
			queryFn: async () => {
				const { data } = await api.post<PolisListRes<'newSubmission'>>(
					'/polaris/api-business-polaris/major/workbasket/filterSubmission',
					{ pageSize, pageNumber }
				);
				return data;
			}
		});
	}
};
