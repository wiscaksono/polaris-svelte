import { taskForms } from '$lib/features/task-forms';
import { searchPolisQueries } from '$lib/features/search-polis/queries';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();
	const [taskFormParams] = await queryClient.fetchQuery(searchPolisQueries.list(params.caseID));
	const currentTaskForm = taskForms[taskFormParams.case_trx];

	return { taskFormParams, currentTaskForm };
};
