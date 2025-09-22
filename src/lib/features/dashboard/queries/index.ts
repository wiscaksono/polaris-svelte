import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type { SlaPerformanceDetailRes, SlaPerformanceRes, TotalCaseDetailRes, TotalCaseRes } from './type';

export type Status = 'New Case' | 'In Progress' | 'Pending'
export type TrxType = 'alteration' | 'financial'
export type Range = 'All Time' | 'Today'

export const rangeObj: Record<Range, number> = { 'All Time': 0, 'Today': 1 }
export const trxTypeObj: Record<TrxType, number> = { 'alteration': 1, 'financial': 2 }
export const statusObj: Record<Status, number> = { 'New Case': 1, 'In Progress': 2, 'Pending': 3 }

export const dashboardQueries = {
  totalCase: (trxType: TrxType) => {
    return queryOptions({
      queryKey: ['dashboard', 'total-case', trxType],
      queryFn: async () => {
        const { data } = await api.get<TotalCaseRes>(`/polaris/api-business-polaris/v1/dashboard/totalCase?trxType=${trxTypeObj[trxType]}`)
        return data
      }
    })
  },
  totalCaseDetail: ({ type, status, range, page, search = '', size }: { type: TrxType; status: Status, range: Range, page: number, search: string, size: number }) => {
    return queryOptions({
      queryKey: ['dashboard', 'total-case-detail', type, status, range, page, search, size],
      queryFn: async () => {
        const { data } = await api.post<TotalCaseDetailRes>('/polaris/api-business-polaris/v1/dashboard/totalcase/detail', {
          today: rangeObj[range],
          status: statusObj[status],
          trxType: trxTypeObj[type],
          page,
          size,
          search
        })
        return data
      }
    })
  },
  slaPerformance: (trxType: TrxType) => {
    return queryOptions({
      queryKey: ['dashboard', 'sla-performance', trxType],
      queryFn: async () => {
        const { data } = await api.post<SlaPerformanceRes>(`/polaris/api-business-polaris/v1/dashboard/slaperformance`, {
          flagDifferentCase: trxTypeObj[trxType]
        })
        return data.dataList
      }
    })
  },
  slaPerformanceDetail: (lusId: number) => {
    return queryOptions({
      queryKey: ['dashboard', 'sla-performance-detail', lusId],
      queryFn: async () => {
        const { data } = await api.post<SlaPerformanceDetailRes>('/polaris/api-business-polaris/v1/dashboard/slaperformance/detail', {
          flagDay: 30, // 30 days
          lusId
        })

        const normalizeChartData = data.chart.map(item => ({ ...item, sla: !item.sla ? 0 : item.sla, date: new Date(item.date) }))

        return {
          ...data,
          chart: normalizeChartData
        }
      }
    })
  }
}
