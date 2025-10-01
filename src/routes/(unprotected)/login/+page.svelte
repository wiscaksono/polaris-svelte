<script lang="ts">
	import { GalleryVerticalEndIcon, LoaderCircle } from '@lucide/svelte';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import { goto } from '$app/navigation';
	import { createMutation } from '@tanstack/svelte-query';

	import { userStore } from '$lib/stores';
	import { api, exclude } from '$lib/utils';
	import { loginQuery } from '$lib/features/login/queries';

	let payload = $state({ username: 'billi', password: 'Asdf12345' });

	const mutation = createMutation(() => ({
		...loginQuery.login(),
		onSuccess: (data) => {
			api.setToken(data.token);
			userStore.current = exclude(data, ['token']);
			goto('/');
		}
	}));

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		mutation.mutate(payload);
	}
</script>

<main class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="##" class="flex items-center gap-2 font-medium">
				<div class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
					<GalleryVerticalEndIcon class="size-4" />
				</div>
				Acme Inc.
			</a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<form class="flex flex-col gap-6" onsubmit={handleLogin} data-testid="login-form">
					<div class="flex flex-col items-center gap-2 text-center">
						<h1 class="text-2xl font-bold">Login to your account</h1>
						<p class="text-sm text-balance text-muted-foreground">Enter your username below to login to your account</p>
					</div>
					<div class="grid gap-6">
						<div class="grid gap-3">
							<Label for="username">Username</Label>
							<Input id="username" required bind:value={payload.username} data-testid="username-input" />
						</div>
						<div class="grid gap-3">
							<Label for="password">Password</Label>
							<Input id="password" type="password" required bind:value={payload.password} data-testid="password-input" />
						</div>
						<Button type="submit" class="w-full" disabled={mutation.isPending} data-testid="login-button">
							Login
							{#if mutation.isPending}
								<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
							{/if}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="relative hidden bg-muted lg:block">
		<img
			src="https://www.shadcn-svelte.com/placeholder.svg"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</main>
