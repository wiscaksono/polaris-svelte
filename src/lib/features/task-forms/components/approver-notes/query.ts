import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import type { ApproverNotesRes } from './type';

export const approverNotesQueries = {
	get: ({ caseId }: { caseId: string | number }) => {
		return queryOptions({
			queryKey: ['approver-notes', caseId],
			queryFn: async () => {
				const { data } = await api.get<ApproverNotesRes>(`/polaris/api-financial-polaris/v1/financial/worksheet/getApproverNotes?idDoc=${caseId}`);
				return data.remarks;
			}
		});
	},
	update: ({ caseId }: { caseId: string }) => {
		return mutationOptions({
			mutationFn: async (remarks: string) => {
				await api.post(`/polaris/api-financial-polaris/v1/financial/worksheet/ApproverNotes`, {
					idDoc: caseId,
					remarks
				});
			}
		});
	}
};
