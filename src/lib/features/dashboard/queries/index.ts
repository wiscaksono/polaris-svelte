import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type * as Type from './type';

export type Status = 'New Case' | 'In Progress' | 'Pending';
export type TrxType = 'alteration' | 'financial';
export type Range = 'All Time' | 'Today';

export const rangeObj: Record<Range, number> = { 'All Time': 0, Today: 1 };
export const trxTypeObj: Record<TrxType, number> = { alteration: 1, financial: 2 };
export const statusObj = { 'New Case': 1, 'In Progress': 2, Pending: 3 } as const;

export const dashboardQueries = {
	totalCase: (trxType: TrxType) => {
		return queryOptions({
			queryKey: ['dashboard', 'total-case', trxType],
			queryFn: async () => {
				const { data } = await api.get<Type.TotalCaseRes>(`/polaris/api-business-polaris/v1/dashboard/totalCase?trxType=${trxTypeObj[trxType]}`);
				return data;
			}
		});
	},
	totalCaseDetail: ({
		type,
		status,
		range,
		page,
		search = '',
		size
	}: {
		type: TrxType;
		status: Status;
		range: Range;
		page: number;
		search: string;
		size: number;
	}) => {
		return queryOptions({
			queryKey: ['dashboard', 'total-case-detail', type, status, range, page, search, size],
			queryFn: async () => {
				const { data } = await api.post<Type.TotalCaseDetailRes>('/polaris/api-business-polaris/v1/dashboard/totalcase/detail', {
					today: rangeObj[range],
					status: statusObj[status],
					trxType: trxTypeObj[type],
					page,
					size,
					search
				});
				return data;
			}
		});
	},
	slaPerformance: (trxType: TrxType) => {
		return queryOptions({
			queryKey: ['dashboard', 'sla-performance', trxType],
			queryFn: async () => {
				const { data } = await api.post<Type.SlaPerformanceRes>(`/polaris/api-business-polaris/v1/dashboard/slaperformance`, {
					flagDifferentCase: trxTypeObj[trxType]
				});
				return data.dataList;
			}
		});
	},
	slaPerformanceDetail: (lusId: number) => {
		return queryOptions({
			queryKey: ['dashboard', 'sla-performance-detail', lusId],
			queryFn: async () => {
				const { data } = await api.post<Type.SlaPerformanceDetailRes>('/polaris/api-business-polaris/v1/dashboard/slaperformance/detail', {
					flagDay: 30, // 30 days
					lusId
				});

				const normalizeChartData = data.chart.map((item) => ({ ...item, sla: !item.sla ? 0 : item.sla, date: new Date(item.date) }));

				return {
					...data,
					chart: normalizeChartData
				};
			}
		});
	},
	totalCaseDiff: (trxType: TrxType) => {
		return queryOptions({
			queryKey: ['dashboard', 'total-case-difference', trxType],
			queryFn: async () => {
				const { data } = await api.post<Type.TotalCaseDiffRes>('/polaris/api-business-polaris/v1/dashboard/totalcase', {
					flagDifferentCase: trxTypeObj[trxType]
				});
				return data.summary;
			}
		});
	},
	byDistributionChannel: ({ trxType, caseStatus, dateRange }: { trxType: TrxType; caseStatus: number; dateRange: number }) => {
		return queryOptions({
			queryKey: ['dashboard', 'by-distribution-channel', trxType, caseStatus, dateRange],
			queryFn: async () => {
				const { data } = await api.post<Type.ByDistributionChannelRes>('/polaris/api-business-polaris/v1/dashboard/totalCase/distribution-channel', {
					trxType: trxTypeObj[trxType],
					jenisApp: [92, 93, 103],
					status: caseStatus,
					dateRange
				});
				return data.map((item) => ({ ...item, date: new Date(item.date) })) as unknown as Type.DynamicData;
			}
		});
	},
	byTransactionType: ({ trxType, caseStatus, dateRange }: { trxType: TrxType; caseStatus: number; dateRange: number }) => {
		return queryOptions({
			queryKey: ['dashboard', 'by-transaction-type', trxType, caseStatus, dateRange],
			queryFn: async () => {
				const { data } = await api.post<Type.ByTransactionTypeRes>('/polaris/api-business-polaris/v1/dashboard/totalCase/transactiontype', {
					flagDifferentCase: trxTypeObj[trxType],
					flagTransactionType: caseStatus,
					flagDay: dateRange
				});

				if (trxType === 'alteration') return data.summaryAlterationTransaction.map((item) => ({ ...item, date: new Date(item.date) })) as Type.DynamicData;
				if (trxType === 'financial') return data.summaryFinancialTransaction.map((item) => ({ ...item, date: new Date(item.date) })) as Type.DynamicData;
			}
		});
	}
};
