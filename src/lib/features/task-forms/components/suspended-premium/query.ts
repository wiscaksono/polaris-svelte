import { api } from "$lib/utils"
import { queryOptions } from "@tanstack/svelte-query"

import type { SuspendedPremiumRes } from "./type"

export const suspendedPremiumQueries = {
  get: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ['suspended-premium', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<SuspendedPremiumRes>(`/polaris/api-financial-polaris/financial/suspendPremium?regSpaj=${regSpaj}`)
        return data
      }
    })
  }
}
