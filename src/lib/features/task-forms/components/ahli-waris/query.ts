import { queryOptions } from "@tanstack/svelte-query"

import { api } from "$lib/utils"
import type { AhliWarisRes } from "./type"

export const ahliWarisQueries = {
  get: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ["ahli-waris", regSpaj],
      queryFn: async () => {
        const { data } = await api.get<AhliWarisRes>(`/polaris/api-financial-polaris/v1/financial/worksheet/getAhliWaris?regSpaj=${regSpaj}`)
        return data
      }
    })
  }
}
