import { api, mutationOptions, transactionIDs, type TransactionType } from '$lib/utils';

import { biayaQueries } from '../../biaya/query';
import { redemptionInstructionQueries } from '../../redemption-instruction/query';

import type { RedemptionReq } from '../redemption/type';

export const realocationQueries = {
  realocate: () => {
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

        await api.post(`/polaris/api-business-polaris/financial/ulink/realocation`, payload)
      }
    });
  }
};

