import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';

import type { ReassignTaskListRes, ReassignTaskUsersRes } from './type';

export const reassignTaskQueries = {
	list: ({ pageSize, pageNumber, caseId }: { pageSize: number; pageNumber: number; caseId: number | null }) => {
		return queryOptions({
			queryKey: ['reassign-task', 'list', pageSize, pageNumber, caseId],
			queryFn: async () => {
				const { data } = await api.post<ReassignTaskListRes>('/polaris/api-business-polaris/major/general/getDataReassign', { pageSize, pageNumber, caseId });
				return data;
			}
		});
	},
	users: ({ jenis_trx, lus_id }: { jenis_trx: string | number; lus_id: string | number }) => {
		return queryOptions({
			queryKey: ['reassign-task', 'users', jenis_trx, lus_id],
			queryFn: async () => {
				const searchParams = new URLSearchParams();
				searchParams.set('jenisTrx', String(jenis_trx));
				searchParams.set('lusId', String(lus_id));

				const { data } = await api.get<ReassignTaskUsersRes>(`/polaris/api-business-polaris/major/general/selectUserPolaris?${searchParams.toString()}`);
				return data;
			}
		});
	},
	assign: () => {
		return mutationOptions({
			mutationFn: async ({ caseId, lusId }: { caseId: number; lusId: number }) => {
				const { data } = await api.post<object>('/polaris/api-business-polaris/major/general/assignManualCase', { caseId, lusId });
				return data;
			}
		});
	}
};
