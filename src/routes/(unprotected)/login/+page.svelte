<script lang="ts">
	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';

	import { userStore } from '$lib/stores';
	import { api, exclude } from '$lib/utils';
	import { loginQuery } from '$lib/features/login/queries';

	let payload = $state({ username: 'billi', password: 'Asdf12345' });

	const mutation = createMutation({
		...loginQuery.login(),
		onSuccess: (data) => {
			api.setToken(data.token);

			userStore.current = exclude(data, ['token']);

			goto('/');
		}
	});

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		$mutation.mutate(payload);
	}
</script>

<main class="grid h-dvh place-items-center">
	<form class="mx-auto w-full max-w-md space-y-2 rounded-lg border p-4" onsubmit={handleLogin}>
		<input name="username" placeholder="Username" class="w-full rounded border border-gray-400 p-2" required bind:value={payload.username} />
		<input name="password" placeholder="Password" class="w-full rounded border border-gray-400 p-2" type="password" required bind:value={payload.password} />
		<button class="w-full rounded-md bg-gray-700 p-2">Login</button>
	</form>
</main>
