import { api } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('api_token');
	if (token) api.setToken(token);
	else api.setToken('');

	return { token };
};
