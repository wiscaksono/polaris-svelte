import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
	const { currentTaskForm } = await parent();
	const currentTaskFormTab = currentTaskForm.find(({ slug }) => slug === params.tab);

	return { currentTaskFormTab };
};
