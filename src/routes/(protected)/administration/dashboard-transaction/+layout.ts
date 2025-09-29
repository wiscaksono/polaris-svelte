import { dashboardTransactionsQueries } from '$lib/features/dashboard-transactions/queries';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { queryClient } = await parent();
	const transactionData = await queryClient.fetchQuery(dashboardTransactionsQueries.transactions());

	return { transactionData };
};
