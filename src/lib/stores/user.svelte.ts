import type { User } from '$lib/type';

export class UserStore {
	private data = $state<User | null>(null);

	constructor() {
		$effect.root(() => {
			const localStorageUser = localStorage.getItem('user');
			if (localStorageUser) this.data = JSON.parse(localStorageUser);
		});
	}

	get user() {
		return this.data;
	}

	set user(user: User | null) {
		localStorage.setItem('user', JSON.stringify(user));
		this.data = user;
	}
}
