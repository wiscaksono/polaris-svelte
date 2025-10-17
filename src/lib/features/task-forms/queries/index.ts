import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions, TRANSACTION_IDS, type TransactionType } from '$lib/utils';

export const taskFormQueries = {
	checkIsReUnderwriting: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['task-form', 'check-is-re-underwriting', noTrx],
			queryFn: async () => {
				const { data } = await api.get<boolean>(`/polaris/api-business-polaris/major/alteration/checkReunderwriting?noTrx=${noTrx}`);
				return data;
			}
		});
	},
	uploadWorksheetPDF: ({ transaction, nopol, caseId, regSpaj, noTrx }: { transaction: TransactionType, nopol: string, caseId: string, regSpaj: string, noTrx: string }) => {
		return mutationOptions({
			mutationFn: async (blob: Blob) => {
				const formData = new FormData();
				const fileName = `${transaction} - Worksheet - ${nopol} - ${caseId}.pdf`;

				formData.append('file', new Blob([blob], { type: 'application/pdf' }), fileName)
				formData.append('regSpaj', regSpaj)
				formData.append('noTrx', noTrx)
				formData.append('idTrx', String(TRANSACTION_IDS[transaction]))
				formData.append('idJn', '345')
				formData.append('flag', '2')
				formData.append('purpose', 'STORAGE_PANDORA')

				return await api.post('/polaris/api-document-polaris/v1/main/upload', formData)
			}
		})
	}
};
