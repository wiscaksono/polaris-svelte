import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
	const { policyDetail, currentTaskForm } = await parent();
	const currentTaskFormTab = currentTaskForm.find(({ slug }) => slug === params.tab);
	return { policyDetail, currentTaskFormTab };
};
