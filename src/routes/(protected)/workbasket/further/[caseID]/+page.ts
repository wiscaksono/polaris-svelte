import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { currentTaskForm } = await parent();
	throw redirect(303, `/workbasket/further/${params.caseID}/${currentTaskForm[0].slug}`);
};
