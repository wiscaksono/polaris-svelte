import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions, transactionIDs, type TransactionType } from '$lib/utils';

import { biayaQueries } from '../../biaya/query';
import { redemptionInstructionQueries } from '../../redemption-instruction/query';

import type { RedemptionReq } from './type';

export const redemptionQueries = {
	checkTransDet: ({ noTrx }: { noTrx: string }) => {
		return queryOptions({
			queryKey: ['get-validation-message', noTrx],
			queryFn: async () => {
				const { data } = await api.get<{ count: boolean }>(`/polaris/api-financial-polaris/financial/getCountRowTransDet?trxFinancial=${noTrx}`);
				return !data.count; // kalo false, dialognya muncul
			}
		});
	},
	redempt: () => {
		return mutationOptions({
			mutationFn: async ({ transaction, noTrx, regSpaj, lusId }: { transaction: TransactionType; noTrx: string; regSpaj: string; lusId: number }, b) => {
				const redemptionInstructionQueryKey = redemptionInstructionQueries.get({ noTrx, transaction }).queryKey;
				const redemptionInstructionQueryData = b.client.getQueryData(redemptionInstructionQueryKey);
				const redemptionTotalUnit = redemptionInstructionQueryData?.reduce((acc, item) => acc + (item.unit ? item.unit : 0), 0) ?? 0;
				const redemptionTotalAmount = redemptionInstructionQueryData?.reduce((acc, item) => acc + (item.amount ? item.amount : 0), 0) ?? 0;

				const biayaQueryKey = biayaQueries.get({ noTrx, regSpaj }).queryKey;
				const biayaQueryData = b.client.getQueryData(biayaQueryKey);

				const payload: RedemptionReq = {
					summary: {
						regSpaj,
						ltId: transactionIDs[transaction],
						jlhPremi: redemptionTotalAmount,
						jlhUnit: redemptionTotalUnit,
						muLspdId: 46,
						muTahunKe: null,
						muPremiKe: null,
						muLusId: lusId,
						idMobile: noTrx,
						appJenisId: 103
					},
					biaya:
						biayaQueryData && biayaQueryData.length > 0
							? biayaQueryData.map((data) => ({
									mbuPersen: data.persen,
									mbuJumlah: data.amount,
									ljbId: data.jenis_biaya_id
								}))
							: []
				};

				switch (transaction) {
					case 'Switching and Redirection':
					case 'Switching':
						await api.post(`/polaris/api-financial-polaris/v1/financial/ulink/switching?noTrx=${noTrx}`, {});
						break;
					default:
						await api.post(`/polaris/api-financial-polaris/financial/redemptionSave`, payload);
						break;
				}
			}
		});
	}
};
