import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
  const { currentTaskForm } = await parent();
  const resolvedUrl = resolve('/(protected)/workbasket/new-submission/[caseID]/[tab]', { caseID: params.caseID, tab: currentTaskForm[0].slug })
  throw redirect(303, resolvedUrl);
};
