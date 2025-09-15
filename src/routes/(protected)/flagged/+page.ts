import { flaggedQueries } from '$lib/queries';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { queryClient } = await parent();
	await queryClient.prefetchQuery(flaggedQueries.list({}));
};
