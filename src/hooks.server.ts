import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('api_token');
	const isLoginPage = event.url.pathname.startsWith('/login');

	if (!token && !isLoginPage) redirect(303, '/login');

	const response = await resolve(event);
	return response;
};
