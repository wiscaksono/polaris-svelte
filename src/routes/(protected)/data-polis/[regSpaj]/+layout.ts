import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import { dataPolisTabs } from '$lib/features/data-polis';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const currentTab = dataPolisTabs.find(({ slug }) => slug === params.tab);
	if (!currentTab)
		throw redirect(
			303,
			resolve('/(protected)/data-polis/[regSpaj]/[tab]', {
				regSpaj: params.regSpaj,
				tab: dataPolisTabs[0].slug
			})
		);

	return { currentTab };
};
