import { api } from "$lib/utils"
import { queryOptions } from "@tanstack/svelte-query"

import type { RedemptionInstructionRes } from "./type"

export const redemptionInstructionQueries = {
  get: ({ noTrx }: { noTrx: string }) => {
    return queryOptions({
      queryKey: ['redemption-instruction', noTrx],
      queryFn: async () => {
        // TODO: handle for different trx, checkout the original code
        const { data } = await api.get<RedemptionInstructionRes>(`/polaris/api-financial-polaris/financial/getRedemption?trxFinancial=${noTrx}`)
        return data
      }
    })
  }
}
