import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { resolve } from '$app/paths';

export const prerender = false;

export const load: LayoutLoad = async ({ parent, params }) => {
	const { currentTaskForm } = await parent();
	const currentTaskFormTab = currentTaskForm.find(({ slug }) => slug === params.tab);

	if (!currentTaskFormTab)
		throw redirect(
			303,
			resolve('/(protected)/workbasket/new-submission/[caseID]/[tab]', {
				caseID: params.caseID,
				tab: currentTaskForm[0].slug
			})
		);

	return { currentTaskFormTab };
};
