import { jwtDecode } from 'jwt-decode';
import { browser } from '$app/environment';

import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';

import { goto } from '$app/navigation';
import type { BaseResponse } from './type';
import { resolve } from '$app/paths';

class API {
	private baseURL: string;
	private isRefreshing = false;

	token: string | undefined;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
		this.token = browser ? (localStorage.getItem('api_token') as string) : undefined;
	}

	setToken(token: string) {
		this.token = token;
		if (browser) localStorage.setItem('api_token', token);
	}

	private async refreshToken(): Promise<void> {
		if (this.isRefreshing) return;
		this.isRefreshing = true;

		try {
			const response = await fetch(this.baseURL + '/auth/refreshToken', {
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` }
			});

			if (!response.ok) throw new Error('Failed to refresh token');

			const result = (await response.json()) as { token: string };
			if (result.token && result.token) {
				this.setToken(result.token);
			} else {
				throw new Error('No new token received');
			}
		} catch (error) {
			console.error('Token refresh failed, logging out.', error);
			this.clearSession();
			throw error; // Re-throw to be caught by the original request
		} finally {
			this.isRefreshing = false;
		}
	}

	private async request<T>(path: string, options?: RequestInit, signal?: AbortSignal): Promise<BaseResponse<T>> {
		if (this.token && this.isTokenExpired(this.token)) {
			console.log('Token expired, attempting to refresh.');
			try {
				await this.refreshToken();
			} catch {
				throw new Error('Unauthorized - Token Refresh Failed');
			}
		}

		const requestOptions: RequestInit = {
			mode: 'cors',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				...(!(options?.body instanceof FormData) && { 'Content-Type': 'application/json' }),
				...(this.token && { Authorization: `Bearer ${this.token}` })
			},
			signal,
			...options
		};

		// Remove Content-Type for FormData to let the browser set it with the boundary
		if (requestOptions.body instanceof FormData && requestOptions.headers) {
			delete (requestOptions.headers as Record<string, string>)['Content-Type'];
		}

		const response = await fetch(`${this.baseURL}${path}`, requestOptions);

		if (response.status === 401) {
			console.log('Server returned 401, logging out.');
			this.clearSession();
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
			throw new Error(JSON.stringify(errorBody));
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
		if (browser) localStorage.removeItem('api_token');
		goto(resolve('/'));
	}

	get<T>(path: string, signal?: AbortSignal) {
		return this.request<T>(path, { method: "GET" }, signal);
	}

	post<T>(path: string, body: FormData | object, signal?: AbortSignal) {
		return this.request<T>(path, {
			method: 'POST',
			body: body instanceof FormData ? body : JSON.stringify(body)
		}, signal);
	}

	put<T>(path: string, body: FormData | object, signal?: AbortSignal) {
		return this.request<T>(path, {
			method: 'PUT',
			body: body instanceof FormData ? body : JSON.stringify(body)
		}, signal);
	}

	delete<T>(path: string, signal?: AbortSignal) {
		return this.request<T>(path, { method: 'DELETE' }, signal);
	}
}

export const api = new API(PUBLIC_BASE_POLARIS_API_URL);
