import { queryOptions } from "@tanstack/svelte-query"

import { api, mutationOptions } from "$lib/utils"
import type { FinancialDataSubmissionRes } from "./type"

export const financialQueries = {
  getDataSubmission: ({ regSpaj, noTrx, type }: { regSpaj: string, noTrx: string, type: string }) => {
    return queryOptions({
      queryKey: ['data-polis', regSpaj, noTrx, type],
      queryFn: async () => {
        const searchParams = new URLSearchParams()

        searchParams.set('regSpaj', regSpaj)
        searchParams.set('noTrx', noTrx)
        searchParams.set('transaction', '3')

        const { data } = await api.get<FinancialDataSubmissionRes>(`/polaris/api-financial-polaris/v1/financial/getFinancialDataNewSub?${searchParams.toString()}`)
        return data
      }
    })
  },
  updateDataSubmission: ({ lusId, noTrx, regSpaj, }: { lusId: number, noTrx: string, regSpaj: string, }) => {
    return mutationOptions({
      mutationFn: async ({ payload, initialData }: { payload: FinancialDataSubmissionRes, initialData: FinancialDataSubmissionRes }) => {
        // TODO: Bind the right transaction ID
        await api.post(`/polaris/api-financial-polaris/v1/financial/saveFinancialDataNewSub?transaction=3`, {
          ...payload,
          before: initialData,
          lusId,
          noTrx,
          regSpaj
        })
      }
    })
  }
}
