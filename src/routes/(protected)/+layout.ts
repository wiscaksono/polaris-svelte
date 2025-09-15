import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const token = localStorage.getItem('api_token');
	if (!token) redirect(303, '/login');
};
