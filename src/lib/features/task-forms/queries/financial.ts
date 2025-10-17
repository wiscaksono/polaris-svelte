import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions, TRANSACTION_IDS, type TransactionType } from '$lib/utils';
import type { FinancialDataSubmissionRes, FinancialPerhitunganOrPengembalianNialaiTunai } from './type';

export const financialQueries = {
	getDataSubmission: ({ regSpaj, noTrx, transaction }: { regSpaj: string; noTrx: string; transaction: TransactionType }) => {
		return queryOptions({
			queryKey: ['data-polis', regSpaj, noTrx, transaction],
			queryFn: async () => {
				const searchParams = new URLSearchParams();

				searchParams.set('regSpaj', regSpaj);
				searchParams.set('noTrx', noTrx);
				searchParams.set('transaction', String(TRANSACTION_IDS[transaction]));

				const { data } = await api.get<FinancialDataSubmissionRes>(`/polaris/api-financial-polaris/v1/financial/getFinancialDataNewSub?${searchParams.toString()}`);
				return data;
			},
		});
	},
	updateDataSubmission: ({ lusId, noTrx, regSpaj, transaction }: { lusId: number; noTrx: string; regSpaj: string; transaction: TransactionType }) => {
		return mutationOptions({
			mutationFn: async ({ payload, initialData }: { payload: FinancialDataSubmissionRes; initialData: FinancialDataSubmissionRes }) => {
				await api.post(`/polaris/api-financial-polaris/v1/financial/saveFinancialDataNewSub?transaction=${TRANSACTION_IDS[transaction]}`, {
					...payload,
					before: initialData,
					lusId,
					noTrx,
					regSpaj
				});
			}
		});
	},
	isButtonRedemptionEnabled: ({ noTrx, transaction }: { noTrx: string, transaction: TransactionType }) => {
		return queryOptions({
			queryKey: ['is-button-redemption-enabled', noTrx, transaction],
			queryFn: async () => {
				if (transaction === 'Redirection') return true;
				if (transaction.includes('Trad')) return true;

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
	},
	perhitunganOrPengembalianNialaiTunai: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['perhitungan-or-pengembalian-nilai-tunai', noTrx],
			queryFn: async () => {
				const { data } = await api.get<FinancialPerhitunganOrPengembalianNialaiTunai>(`/polaris/api-financial-polaris/v1/financial/getPerhitunganNilaiTunai?noTrx=${noTrx}`);
				return data;
			}
		})
	},
	updatePerhitunganOrPengembalianNialaiTunai: ({ noTrx }: { noTrx: string }) => {
		return mutationOptions({
			mutationFn: async (payload: FinancialPerhitunganOrPengembalianNialaiTunai) => await api.post(`/polaris/api-financial-polaris/v1/financial/tunai/update?noTrx=${noTrx}`, payload)
		})
	}
};
