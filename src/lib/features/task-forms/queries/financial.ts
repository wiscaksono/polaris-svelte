import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions, transactionIDs, type TransactionType } from '$lib/utils';
import type { FinancialDataSubmissionRes } from './type';

export const financialQueries = {
	getDataSubmission: ({ regSpaj, noTrx, type }: { regSpaj: string; noTrx: string; type: string }) => {
		return queryOptions({
			queryKey: ['data-polis', regSpaj, noTrx, type],
			queryFn: async () => {
				const searchParams = new URLSearchParams();

				searchParams.set('regSpaj', regSpaj);
				searchParams.set('noTrx', noTrx);
				searchParams.set('transaction', '3');

				const { data } = await api.get<FinancialDataSubmissionRes>(
					`/polaris/api-financial-polaris/v1/financial/getFinancialDataNewSub?${searchParams.toString()}`
				);
				return data;
			}
		});
	},
	updateDataSubmission: ({ lusId, noTrx, regSpaj, transaction }: { lusId: number; noTrx: string; regSpaj: string; transaction: TransactionType }) => {
		return mutationOptions({
			mutationFn: async ({ payload, initialData }: { payload: FinancialDataSubmissionRes; initialData: FinancialDataSubmissionRes }) => {
				await api.post(`/polaris/api-financial-polaris/v1/financial/saveFinancialDataNewSub?transaction=${transactionIDs[transaction]}`, {
					...payload,
					before: initialData,
					lusId,
					noTrx,
					regSpaj
				});
			}
		});
	},
	isButtonRedemptionEnabled: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['is-button-redemption-enabled', noTrx],
			queryFn: async () => {
				const { data } = await api.get<boolean>(`/polaris/api-financial-polaris/financial/buttonRedemptionEnable?noTransaksi=${noTrx}`);
				return data;
			}
		});
	},
	isButtonRealocationEnabled: ({ noTrx, transaction }: { noTrx: string; transaction: TransactionType }) => {
		return queryOptions({
			queryKey: ['is-button-realocation-enabled', noTrx, transaction],
			queryFn: async () => {
				if (transaction === 'Redirection') return true;
				const { data } = await api.get<boolean>(`/polaris/api-financial-polaris/financial/buttonRealocationEnable?noTransaksi=${noTrx}`);
				return data;
			}
		});
	}
};
