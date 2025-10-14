import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

import { taskForms } from '$lib/features/task-forms';
import { searchPolisQueries } from '$lib/features/search-polis/queries';

import type { LayoutLoad } from './$types';

export const prerender = false;

export const load: LayoutLoad = async ({ parent, params }) => {
	const { queryClient } = await parent();
	const [taskFormParams] = await queryClient.fetchQuery(searchPolisQueries.list(params.caseID));

	if (taskFormParams.kind === 'Further') {
		throw redirect(307, resolve('/(protected)/workbasket/further/[caseID]', { caseID: String(taskFormParams.case_id) }));
	} else if (taskFormParams.kind === 'Filling') {
		throw redirect(307, resolve('/(protected)/workbasket/filling/[caseID]', { caseID: String(taskFormParams.case_id) }));
	}

	const currentTaskForm = taskForms[taskFormParams.case_trx];

	return { taskFormParams, currentTaskForm };
};
