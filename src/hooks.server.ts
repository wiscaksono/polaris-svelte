import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { ApiError } from '$lib/api';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('api_token');
	const isLoginPage = event.url.pathname.startsWith('/login');

	if (!token && !isLoginPage) redirect(303, '/login');

	const response = await resolve(event);
	return response;
};

export const handleError: HandleServerError = ({ error, status, message }) => {
	const errorId = crypto.randomUUID();
	const timestamp = new Date().toISOString();

	const red = (msg: string) => `\x1b[31m${msg}\x1b[0m`;
	const yellow = (msg: string) => `\x1b[33m${msg}\x1b[0m`;
	const gray = (msg: string) => `\x1b[90m${msg}\x1b[0m`;

	if (error instanceof ApiError) {
		console.error(
			`\n${red('✖ API Error')} ${gray(`[${timestamp}]`)}\n` +
				`${yellow('Error ID:')} ${errorId}\n` +
				`${yellow('Status:')} ${error.status}\n` +
				`${yellow('Status Text:')} ${error.statusText}\n` +
				`${yellow('Body:')} ${JSON.stringify(error.body, null, 2)}\n`
		);
	} else if (error instanceof Error) {
		// Handle other standard Error objects
		console.error(
			`\n${red('✖ Unexpected Error')} ${gray(`[${timestamp}]`)}\n` +
				`${yellow('Error ID:')} ${errorId}\n` +
				`${yellow('Message:')} ${error.message}\n` +
				`${gray(error.stack || 'No stack trace')}\n`
		);
	} else {
		// Handle non-Error objects
		console.error(
			`\n${red('✖ Unknown Error')} ${gray(`[${timestamp}]`)}\n` +
				`${yellow('Error ID:')} ${errorId}\n` +
				`${yellow('Payload:')} ${JSON.stringify(error, null, 2)}\n`
		);
	}

	const clientMessage =
		status && status >= 400 && status < 500
			? message
			: 'Sorry, something went wrong while processing your request. Please contact support and provide this reference code bellow';

	return { message: clientMessage, errorId };
};
