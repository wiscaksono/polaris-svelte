import { dashboardTransactionsQueries, type TimeRangeValues } from '$lib/features/dashboard-transactions/queries';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const currentTimeRange = (url.searchParams.get('timeRange') as TimeRangeValues) ?? 'week';

	const { queryClient } = await parent();
	const transactionData = await queryClient.fetchQuery(dashboardTransactionsQueries.transactions(currentTimeRange));

	return { transactionData };
};
