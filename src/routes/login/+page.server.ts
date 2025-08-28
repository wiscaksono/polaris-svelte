import { redirect } from '@sveltejs/kit';

import { api } from '$lib/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const token = cookies.get('api_token');
	if (token) redirect(303, '/');
};

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const { username, password } = Object.fromEntries(formData);

		const { data } = await api.post<{ token: string }>('/auth/loginNewPolaris', {
			username,
			password
		});

		cookies.set('api_token', data.token, { path: '/' });

		redirect(303, '/');
	}
} satisfies Actions;
