import { queryOptions } from "@tanstack/svelte-query"
import { api } from "$lib/utils"

import type { DashboardTransactionsRes } from "./type"

export const dashboardTransactionsQueries = {
  transactions: () => {
    return queryOptions({
      queryKey: ["dashboard-transactions", "transactions"],
      queryFn: async () => {
        const { data } = await api.post<DashboardTransactionsRes>("/polaris/api-business-polaris/v1/dashboard/transaction", { date: { from: "2025-09-20T07:06:42.737Z", to: "2025-09-27T07:06:42.737Z" } })
        return data
      }
    })
  }
}
