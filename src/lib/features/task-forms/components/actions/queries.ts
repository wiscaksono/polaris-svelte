import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions, IS_DEV, type TransactionType, transactionIDs } from '$lib/utils';

import * as Type from './type';

export const actionQueries = {
	cancelTicketMajor: ({ lusId, noTrx, regSpaj, docId, nopol, transaction }: { lusId: number; noTrx: string; regSpaj: string; docId: number; nopol: string, transaction: TransactionType }) => {
		return mutationOptions({
			mutationFn: async ({ remarks, reason, file }: { remarks: string; reason: string; file: FileList | undefined }) => {
				const promises: Promise<unknown>[] = [];

				promises.push(
					api.post('/polaris/api-business-polaris/major/alteration/cancelFurther', {
						docId,
						remarks,
						regSpaj,
						reason,
						lusId,
						trxMajor: noTrx
					})
				);

				if (file) {
					const formData = new FormData();
					formData.append('file', file[0], file[0].name);
					formData.append('regSpaj', regSpaj);
					formData.append('noTrx', noTrx);
					formData.append('idTrx', String(transactionIDs[transaction]));
					formData.append('idJn', '303');
					formData.append('flag', '2');
					formData.append('purpose', 'STORAGE');

					promises.push(api.post('/polaris/api-document-polaris/v1/main/upload', formData));
				}

				if (IS_DEV) {
					promises.push(
						api.post(`/polaris/api-simultansar-polaris/major/payloadUrsa`, {
							trxMajor: noTrx,
							regSpaj,
							noPolis: nopol
						})
					);
				}

				await Promise.all(promises);
			}
		});
	},
	getApproveButtonState: ({ docId, regSpaj, trxMajor, lusId }: { docId: number; regSpaj: string; trxMajor: string; lusId: number }) => {
		return queryOptions({
			queryKey: ['action-approve', 'get-button-state', docId, regSpaj, trxMajor, lusId],
			queryFn: async () => {
				const { data } = await api.post<Type.ApproveButtonStateRes>('/polaris/api-business-polaris/major/alteration/buttonApproval', {
					regSpaj,
					docId,
					trxMajor,
					lusId
				});

				return data;
			}
		});
	},
	getApproveButtonOldProduct: ({ trxMajor, regSpaj }: { trxMajor: string; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['action-approve', 'validate-button-state', trxMajor, regSpaj],
			queryFn: async () => {
				const { message } = await api.get<boolean>(
					`/polaris/api-business-polaris/major/general/validateProductAndBilling/?noTrx=${trxMajor}&regSpaj=${regSpaj}`
				);
				return message;
			}
		});
	},
	getApprovalButtonLimitValidation: ({ docId, regSpaj, trxMajor, lusId }: { docId: number; regSpaj: string; trxMajor: string; lusId: number }) => {
		return queryOptions({
			queryKey: ['action-approve', 'todo', docId, regSpaj, trxMajor, lusId],
			queryFn: async () => {
				const { data } = await api.post<Type.ApproveButtonLimitValidationRes>('/polaris/api-business-polaris/major/alteration/validasiApproval', {
					regSpaj,
					docId,
					trxMajor,
					lusId
				});
				return data;
			}
		});
	},
	insertEscalationHistory: () => {
		return mutationOptions({
			mutationFn: async ({ noTrx, remarks }: { noTrx: string; remarks: string }) => {
				await api.post('/polaris/api-business-polaris/v1/general/escalateToTeamLead', { noTrx, remarks });
			}
		});
	},
	pendingMajor: () => {
		return mutationOptions({
			mutationFn: async ({ regSpaj, docId, trxMajor, lusId }: { regSpaj: string; docId: number; trxMajor: string; lusId: number }) => {
				await api.post('/polaris/api-business-polaris/major/alteration/pendingFurther', {
					regSpaj,
					docId,
					lusId,
					trxMajor
				});
			}
		});
	},
	pendingFinancial: () => {
		return mutationOptions({
			mutationFn: async ({ regSpaj, docId, trxMajor, lusId }: { regSpaj: string; docId: number; trxMajor: string; lusId: number }) => {
				await api.post('/polaris/api-financial-polaris/v1/financial/action/pendingFurther', {
					regSpaj, lusId, docId, trxFin: trxMajor
				});
			}
		});
	},
	cancelTicketFinancial: ({ lusId, noTrx, regSpaj, caseId, transaction }: { lusId: number, noTrx: string, regSpaj: string, caseId: number, transaction: TransactionType }) => {
		return mutationOptions({
			mutationFn: async (file: FileList) => {
				const cancel = api.post('/polaris/api-financial-polaris/v1/financial/action/buttonCancel', {
					docId: caseId,
					lusId,
					trxFinancial: noTrx,
					regSpaj
				})

				const formData = new FormData();
				formData.append('file', file[0], file[0].name);
				formData.append('regSpaj', regSpaj);
				formData.append('noTrx', noTrx);
				formData.append('idTrx', String(transactionIDs[transaction]));
				formData.append('idJn', '303');
				formData.append('flag', '2');
				formData.append('purpose', 'STORAGE');

				const upload = api.post('/polaris/api-document-polaris/v1/main/upload', formData);

				await Promise.all([cancel, upload])

				return cancel;

			}
		})
	},
	decline: ({ noTrx, regSpaj, caseId }: { noTrx: string; regSpaj: string; caseId: number }) => {
		return mutationOptions({
			mutationFn: async () => await api.post(`/polaris/api-financial-polaris/v1/financial/action/buttonDecline`, { docId: caseId, regSpaj, trxFinancial: noTrx })
		})
	}
};
