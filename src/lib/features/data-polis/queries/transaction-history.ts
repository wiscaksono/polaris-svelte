import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type * as Type from './type';

export const dataPolisTransactionHistoryQueries = {
	historyEdit: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'history-edit', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisTransactionHistoryEditRes>(`/polaris/api-summary-polaris/data/polis/history-edit?regSpaj=${regSpaj}`);
				return data;
			}
		});
	},
	historySurat: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'history-surat', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisTransactionHistorySuratRes>(`/polaris/api-summary-polaris/data/polis/history-surat?regSpaj=${regSpaj}`);
				return data;
			}
		});
	},
	historyStatusPolis: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'history-status-polis', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisHistoryStatusPolisRes>(`/polaris/api-summary-polaris/data/polis/histStatusPolis?regSpaj=${regSpaj}`);
				return data;
			}
		});
	},
	historyNotifikasi: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'history-notifikasi', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisHistoryNotifikasiRes>(`/polaris/api-summary-polaris/data/polis/history-notifikasi?regSpaj=${regSpaj}`);
				return data;
			}
		});
	},
	positionSPAJ: (regSpaj: string) => {
		return queryOptions({
			queryKey: ['data-polis', 'position-spaj', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<Type.DataPolisPositionSPAJRes>(`/polaris/api-summary-polaris/data/polis/position-spaj?regSpaj=${regSpaj}`);
				return data;
			}
		});
	}
};
