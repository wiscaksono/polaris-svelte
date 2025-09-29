import dayjs from 'dayjs';

import { queryOptions } from '@tanstack/svelte-query';
import { api } from '$lib/utils';

import type { DashboardTransactionsRes, DashboardTransactionsDetailRes } from './type';

export const timeRanges = [
	{ label: 'Week', value: 'week' },
	{ label: 'Month', value: 'month' },
	{ label: 'Year', value: 'year' }
] as const;

export type TimeRangeValues = (typeof timeRanges)[number]['value'];

export const dashboardTransactionsQueries = {
	transactions: (range: TimeRangeValues = 'week') => {
		return queryOptions({
			queryKey: ['dashboard-transactions', 'transactions', range],
			queryFn: async () => {
				const { data } = await api.post<DashboardTransactionsRes>('/polaris/api-business-polaris/v1/dashboard/transaction', {
					date: getDateRange(range)
				});
				return data;
			}
		});
	},
	transactionDetails: (range: TimeRangeValues = 'week') => {
		return queryOptions({
			queryKey: ['dashboard-transactions', 'transaction-details', range],
			queryFn: async () => {
				const { data } = await api.post<DashboardTransactionsDetailRes>('/polaris/api-business-polaris/v1/dashboard/transaction/detail', {
					date: getDateRange(range),
					showOnlyIssues: false
				});
				return data.transaction;
			}
		});
	}
};

function getDateRange(range: TimeRangeValues = 'week') {
	const now = dayjs();
	let from: Date;
	let to: Date;

	switch (range) {
		case 'week':
			// 7 days before now to now
			from = now.subtract(7, 'day').startOf('day').toDate();
			to = now.endOf('day').toDate();
			break;
		case 'month':
			// last month from now to now
			from = now.subtract(1, 'month').startOf('day').toDate();
			to = now.endOf('day').toDate();
			break;
		case 'year':
			// last year from now to now
			from = now.subtract(1, 'year').startOf('day').toDate();
			to = now.endOf('day').toDate();
			break;
		default:
			from = now.startOf('day').toDate();
			to = now.endOf('day').toDate();
			break;
	}

	return { from, to };
}
