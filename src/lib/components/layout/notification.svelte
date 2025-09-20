<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import { Bell } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';

	/**
	 * The current state of the notification permission.
	 * 'default': The user has not yet been asked for permission.
	 * 'granted': The user has granted permission.
	 * 'denied': The user has denied permission.
	 */
	let notificationPermission = $state<NotificationPermission>('default');

	// onMount ensures this code only runs in the browser, not on the server.
	onMount(() => {
		// Check if the Notification API is supported by the browser.
		if ('Notification' in window) {
			notificationPermission = Notification.permission;
		}
	});

	/**
	 * Requests permission if necessary and then shows a sample notification.
	 */
	async function requestAndShowNotification() {
		if (!('Notification' in window)) {
			console.error('This browser does not support desktop notifications.');
			alert('This browser does not support desktop notifications.');
			return;
		}

		// If permission has already been granted, show the notification.
		if (notificationPermission === 'granted') {
			new Notification('Hello from Svelte!', {
				body: 'This is a browser notification.',
				icon: '/favicon.ico' // Optional: path to an icon
			});
			return;
		}

		// If permission has not been denied yet, request it from the user.
		if (notificationPermission !== 'denied') {
			const permission = await Notification.requestPermission();
			notificationPermission = permission;

			// If the user grants permission, show a confirmation notification.
			if (permission === 'granted') {
				new Notification('Permission Granted!', {
					body: 'You will now receive notifications.',
					icon: '/favicon.ico'
				});
			}
		}

		// If permission is 'denied', we can't do anything. The user must
		// manually enable permissions in their browser settings.
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="outline" class="relative">
				<Bell />
				<Badge class="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end">
		<div class="w-full max-w-sm rounded-lg border p-4 text-center">
			{#if !('Notification' in window)}
				<p class="text-yellow-600">Your browser does not support notifications.</p>
			{:else if notificationPermission === 'denied'}
				<p class="font-medium text-red-600">Notification permissions are blocked.</p>
				<p class="mt-1 text-sm text-gray-500">Please enable them in your browser settings to receive notifications.</p>
			{:else}
				<Button onclick={requestAndShowNotification} class="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700">
					Show a Notification
				</Button>
				<p class="mt-2 text-sm text-gray-500">
					Current Status: <strong class="capitalize">{notificationPermission}</strong>
				</p>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
