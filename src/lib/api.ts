import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';

export interface BaseResponse<T> {
	result: string;
	error: boolean;
	message: string;
	data: T;
}

// Custom error class for API failures
export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		public body?: unknown
	) {
		super(statusText);
		this.name = 'ApiError';
	}
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

			if (!response.ok) {
				// Attempt to parse a JSON body for more detailed error messages
				let errorBody;
				try {
					errorBody = await response.json();
				} catch (e: unknown) {
					if (e instanceof Error) {
						console.error('Failed to parse JSON:', e.message);
					} else {
						console.error('An unknown error occurred during JSON parsing.');
					}
					errorBody = await response.text();
				}
				throw new ApiError(response.status, response.statusText, errorBody);
			}

			// The original API call's return type is now handled in the catch block above
			// to avoid silently failing when response.ok is false.
			return response.json() as Promise<BaseResponse<T>>;
		} catch (error) {
			// Catch network-related errors (e.g., failed to fetch, network offline)
			// and also re-throw our custom ApiError for consistency.
			console.error(`API request to ${path} failed:`, error);
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
