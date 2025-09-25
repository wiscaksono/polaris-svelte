import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import { reportTabs } from '$lib/features/reports';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
  const currentTab = reportTabs.find(({ slug }) => slug === params.tab);
  if (!currentTab) throw redirect(303, resolve('/(protected)/reports/[tab]', { tab: reportTabs[0].slug }));
  return { currentTab };
};
