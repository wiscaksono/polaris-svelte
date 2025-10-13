import { queryOptions } from "@tanstack/svelte-query"

import { api, type TransactionType } from "$lib/utils"

import type { RedemptionInstructionRes } from "./type"

export const redemptionInstructionQueries = {
  get: ({ noTrx, transaction }: { noTrx: string, transaction: TransactionType }) => {
    return queryOptions({
      queryKey: ['redemption-instruction', noTrx],
      queryFn: async () => {
        const { data } = await api.get<RedemptionInstructionRes>(
          transaction.includes('Switching')
            ? `/polaris/api-financial-polaris/v2/financial/redemptions/switching?trxFinancial=${noTrx}`
            : `/polaris/api-financial-polaris/financial/getRedemption?trxFinancial=${noTrx}`
        )
        return data
      }
    })
  }
}
