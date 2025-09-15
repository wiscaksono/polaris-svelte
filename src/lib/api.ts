import { jwtDecode } from 'jwt-decode';
import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';
import { goto } from '$app/navigation';

export interface BaseResponse<T> {
	result: string;
	error: boolean;
	message: string;
	data: T;
}

class API {
	private baseURL: string;
	token: string | undefined;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
		this.token = localStorage.getItem('api_token') ?? undefined;
	}

	setToken(token: string) {
		this.token = token;
		localStorage.setItem('api_token', token);
	}

	private async request<T>(path: string, options?: RequestInit) {
		let requestOptions: RequestInit;

		if (this.token && this.isTokenExpired(this.token)) {
			console.log('Token expired on client, logging out.');
			this.clearSession();
			throw new Error('Unauthorized - Token Expired');
		}

		if (options?.body instanceof FormData) {
			const headers = new Headers();
			headers.set('Content-Type', 'multipart/form-data');
			requestOptions = { method: 'POST', headers, body: options?.body };
		} else {
			requestOptions = {
				mode: 'cors',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': options?.body instanceof FormData ? 'multipart/form-data' : 'application/json',
					...(this.token && { Authorization: `Bearer ${this.token}` })
				},
				...options
			};
		}

		const response = await fetch(`${this.baseURL}${path}`, requestOptions);

		if (response.status === 401) {
			console.log('Server returned 401, logging out.');
			this.clearSession();
			// Re-throw the error to be handled by the consuming component
			throw new Error(response.statusText);
		}

		if (!response.ok) {
			let errorBody;
			try {
				errorBody = await response.json();
			} catch (e: unknown) {
				console.error('Failed to parse JSON for error body:', e);
				errorBody = await response.text();
			}
			throw new Error(errorBody);
		}

		return response.json() as Promise<BaseResponse<T>>;
	}

	private isTokenExpired(token: string) {
		try {
			const decodedToken = jwtDecode(token);
			const { exp } = decodedToken;
			if (typeof exp !== 'number') return true;
			const currentTime = Math.round(Date.now() / 1000);

			return exp < currentTime;
		} catch (error) {
			console.error('Error decoding token:', error);
			return true;
		}
	}

	private clearSession() {
		this.token = undefined;
		localStorage.removeItem('api_token');
		goto('/');
	}

	get<T>(path: string) {
		return this.request<T>(path);
	}

	post<T>(path: string, body: FormData | Record<string, unknown>) {
		return this.request<T>(path, {
			method: 'POST',
			body: body instanceof FormData ? body : JSON.stringify(body)
		});
	}

	put<T>(path: string, body: FormData | Record<string, unknown>) {
		return this.request<T>(path, {
			method: 'PUT',
			body: body instanceof FormData ? body : JSON.stringify(body)
		});
	}

	delete<T>(path: string) {
		return this.request<T>(path, { method: 'DELETE' });
	}
}

export const api = new API(PUBLIC_BASE_POLARIS_API_URL);
