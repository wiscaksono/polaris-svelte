import { queryOptions } from "@tanstack/svelte-query"

import { api } from "$lib/utils"

import * as Type from './type'

export const reportQueries = {
  trxTypeList: (transactionType: number | string | undefined) => {
    return queryOptions({
      queryKey: ['reports', 'transaction-list', transactionType],
      queryFn: async () => {
        if (typeof transactionType === 'undefined') return []

        const { data } = await api.get<Type.ReportsTransactionListRes>(`/polaris/api-business-polaris/v1/general/transaction-list?flag=${transactionType}`)
        return data
      }
    })
  },
  trxReportResult: ({ ltId, fromDate, toDate }: { ltId: number[], fromDate: string, toDate: string }) => {
    return queryOptions({
      queryKey: ['reports', 'transaction-list', ltId, fromDate, toDate],
      queryFn: async () => {
        const { data } = await api.post<Type.ReportTransactionResultRes>('/polaris/api-document-polaris/v1/report/transaction', {
          ltId,
          fromDate, // YY MM DD Format
          toDate // YY MM DD Format
        })
        return data
      },
      enabled: () => {
        if (ltId.length === 0) return false
        return true
      }
    })
  }
}
