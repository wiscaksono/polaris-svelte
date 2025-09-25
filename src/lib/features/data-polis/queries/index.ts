import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type * as Type from './type';

export * from './summary';
export * from './client-roles';

export const dataPolisQueries = {
	list: ({ pageSize = 10, pageNumber = 1, noPolis }: { pageSize?: number; pageNumber?: number; noPolis?: string }) => {
		return queryOptions({
			queryKey: ['data-polis', 'list', pageSize, pageNumber, noPolis],
			queryFn: async () => {
				const { data } = await api.post<Type.DataPolisListRes>('/polaris/api-business-polaris/major/workbasket/dataMajor', { pageSize, pageNumber, noPolis });
				return data;
			}
		});
	},
	dueDiligence: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'due-diligence', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisDueDiligenceRes>(`/polaris/api-summary-polaris/summary/due-diligent?regSpaj=${regSpaj}`);
				return data;
			}
		});
	}
};
