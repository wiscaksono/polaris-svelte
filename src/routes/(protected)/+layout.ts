import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (!browser) return;

	const token = localStorage.getItem('api_token');
	if (!token) redirect(303, '/login');
};
