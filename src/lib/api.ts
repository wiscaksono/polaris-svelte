import { browser } from '$app/environment';
import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';

export interface BaseResponse<T> {
	result: string;
	error: boolean;
	message: string;
	data: T;
}

class API {
	private baseURL: string;
	private token: string | undefined;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
		this.token = browser ? (localStorage.getItem('user_token') ?? undefined) : undefined;
	}

	setToken(token: string) {
		this.token = token;
		localStorage.setItem('api_token', token);
	}

	private async request<T>(path: string, options?: RequestInit) {
		let requestOptions: RequestInit;

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
					'Content-Type':
						options?.body instanceof FormData ? 'multipart/form-data' : 'application/json',
					...(this.token && { Authorization: `Bearer ${this.token}` })
				},
				...options
			};
		}

		try {
			const response = await fetch(`${this.baseURL}${path}`, requestOptions);
			if (!response.ok) throw new Error(response.statusText);
			return response.json() as Promise<BaseResponse<T>>;
		} catch (error) {
			console.error(error);
			throw error;
		}
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
