import { queryOptions } from "@tanstack/svelte-query"

import { api, mutationOptions } from "$lib/utils"

export const changeStatusQueries = {
  isEnabled: ({ noTrx }: { noTrx: string }) => {
    return queryOptions({
      queryKey: ['is-change-status-enabled'],
      queryFn: async () => {
        const { data } = await api.get<boolean>(`/polaris/api-financial-polaris/financial/buttonChangeStatusEnable?noTransaksi=${noTrx}`)
        return !data
      }
    })
  },
  changeStatus: ({ caseId, regSpaj, noTrx }: { caseId: number, noTrx: string; regSpaj: string }) => {
    return mutationOptions({
      mutationFn: async () => {
        await api.put('/polaris/api-financial-polaris/financial/changeStatusPolis', {
          caseId,
          noTransaksi: noTrx,
          regSpaj: regSpaj
        })
      }
    })
  }
}
