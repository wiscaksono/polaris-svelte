import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import type { NotificationRes } from './type';

const REFETCH_INTERVAL = 10_000; // 10 sec

export const notificationQueries = {
	get: ({ lusId }: { lusId: number }) => {
		return queryOptions({
			queryKey: ['notification', lusId],
			queryFn: async () => {
				const { data } = await api.post<NotificationRes>('/polaris/api-notification-polaris/notification/list', { lusId });
				return data;
			},
			refetchOnWindowFocus: true,
			refetchInterval: REFETCH_INTERVAL
		});
	},
	count: ({ lusId }: { lusId: string | number }) => {
		return queryOptions({
			queryKey: ['notification', 'count', lusId],
			queryFn: async () => {
				const data = (await api.get(`/polaris/api-notification-polaris/notification/count/${lusId}`)) as unknown as number;
				return data;
			},
			refetchOnWindowFocus: true,
			refetchInterval: REFETCH_INTERVAL
		});
	},
	read: () => {
		return mutationOptions({
			mutationFn: async ({ noId }: { noId: number }) => await api.put('/polaris/api-notification-polaris/notification/push', { noId })
		});
	},
	readAll: () => {
		return mutationOptions({
			mutationFn: async (lusId: number) => await api.put('/polaris/api-notification-polaris/notification/push-all', { lusId })
		});
	}
};
