import { api } from '$lib/api';

import type { ListMenu } from '$lib/type';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	let listMenu: ListMenu[] | undefined;

	const token = cookies.get('api_token');

	if (token) {
		api.setToken(token);
		const { data } = await api.get<ListMenu[]>('/polaris/api-user-pol/general/list-menu');
		listMenu = data;
	} else {
		api.setToken('');
	}

	return { token, listMenu };
};
