import { queryOptions } from "@tanstack/svelte-query"

import { api } from "$lib/utils"
import type { BiayaRes } from "./type"

export const biayaQueries = {
  get: ({ noTrx, regSpaj }: { noTrx: string, regSpaj: string }) => {
    return queryOptions({
      queryKey: ['biaya', noTrx, regSpaj],
      queryFn: async () => {
        const { data } = await api.get<BiayaRes>(`/polaris/api-financial-polaris/financial/getBiayaDataInvestasi?trxFinancial=${noTrx}&regSpaj=${regSpaj}`)
        return data
      }
    })
  }
}
