import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { resolve } from '$app/paths';

export const load: PageLoad = () => {
	throw redirect(303, resolve('/administration/dashboard-transaction/processing-time'));
};
