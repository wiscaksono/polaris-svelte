import { queryOptions } from '@tanstack/svelte-query';
import { api, mutationOptions } from '$lib/utils';
import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';

import * as Type from './type';

export const reportQueries = {
	trxTypeList: (transactionType: number | string | undefined) => {
		return queryOptions({
			queryKey: ['reports', 'transaction-list', transactionType],
			queryFn: async () => {
				if (typeof transactionType === 'undefined') return [];

				const { data } = await api.get<Type.ReportsTransactionListRes>(`/polaris/api-business-polaris/v1/general/transaction-list?flag=${transactionType}`);
				return data;
			}
		});
	},
	reportTransaksi: ({ ltId, fromDate, toDate }: { ltId: number[]; fromDate: string; toDate: string }) => {
		return queryOptions({
			queryKey: ['reports', 'report-transaksi', ltId, fromDate, toDate],
			queryFn: async () => {
				const { data } = await api.post<Type.ReportTransactionRes>('/polaris/api-document-polaris/v1/report/transaction', {
					ltId,
					fromDate, // YY MM DD Format
					toDate // YY MM DD Format
				});
				return data;
			},
			enabled: () => {
				if (ltId.length === 0) return false;
				return true;
			}
		});
	},
	reportFinancial: ({ type, fromDate, toDate }: { type: number[]; fromDate: string; toDate: string }) => {
		return queryOptions({
			queryKey: ['reports', 'report-financial', type, fromDate, toDate],
			queryFn: async () => {
				const { data } = await api.post<Type.ReportFinancialRes>('/polaris/api-document-polaris/v1/report/financialAllTrx', {
					type,
					fromDate, // YY MM DD Format
					toDate // YY MM DD Format
				});
				return data;
			}
		});
	},
	reportFinancialExport: ({ type, fromDate, toDate }: { type: number[]; fromDate: string; toDate: string }) => {
		return mutationOptions({
			mutationFn: async () => {
				const response = await fetch(`${PUBLIC_BASE_POLARIS_API_URL}/polaris/api-document-polaris/v1/report/generate/financial`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						type,
						fromDate, // YY MM DD Format
						toDate // YY MM DD Format
					})
				});
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'report-financial.xlsx';
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
			}
		});
	},
	reportReconcileInvestasi: ({ transactionName, fromDate, toDate }: { transactionName: string; fromDate: string; toDate: string }) => {
		return queryOptions({
			queryKey: ['reports', 'reconcile-investasi', transactionName, fromDate, toDate],
			queryFn: async () => {
				const searchParams = new URLSearchParams();
				searchParams.append('transactionName', transactionName);
				searchParams.append('fromDate', fromDate); // DD-MM-YYYY
				searchParams.append('toDate', toDate); // DD-MM-YYYY

				const { data } = await api.get<Type.ReportReconcileInvestasiRes>(
					`/polaris/api-financial-polaris/v1/financial/reportFinancial?${searchParams.toString()}`
				);
				return data;
			}
		});
	},
	reportReconcileInvestasiExport: ({ from, to }: { from: string; to: string }) => {
		return mutationOptions({
			mutationFn: async () => {
				const response = await fetch(`${PUBLIC_BASE_POLARIS_API_URL}/polaris/api-financial-polaris/v1/financial/generate-report-transaksi`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						ltId: [1, 2, 3, 4, 5, 18],
						fromDate: from, // DD-MM-YYYY
						toDate: to // DD-MM-YYYY
					})
				});
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'report-financial.xlsx';
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
			}
		});
	}
};
