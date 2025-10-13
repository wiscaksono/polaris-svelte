<script lang="ts">
	import dayjs from 'dayjs';
	import { mode } from 'mode-watcher';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import { Bell, Clock, LoaderCircle } from '@lucide/svelte';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createQuery, useQueryClient, createMutation } from '@tanstack/svelte-query';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	import { cn } from '$lib/utils';
	import { userStore } from '$lib/stores';
	import { notificationQueries } from './query';
	import { searchPolisQueries } from '../search-polis/queries';

	import type { NotificationRes } from './type';

	dayjs.extend(relativeTime);

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');

	function formatNotificationDate(date: string | Date): string {
		const notificationDate = dayjs(date);
		const now = dayjs();

		// Check if the difference in hours is less than 24
		if (now.diff(notificationDate, 'hour') < 24) {
			return notificationDate.fromNow(); // e.g., "a few seconds ago", "5 hours ago"
		} else {
			return notificationDate.format('DD MMM YYYY, HH:mm'); // e.g., "13 Oct 2025, 22:06"
		}
	}

	const queryClient = useQueryClient();
	const readNotifMutation = createMutation(() => notificationQueries.read());
	const readAllNotifMutation = createMutation(() => notificationQueries.readAll());
	const notifQuery = createQuery(() => notificationQueries.get({ lusId: userStore.current!.lus_id }));
	const notifCountQuery = createQuery(() => notificationQueries.count({ lusId: userStore.current!.lus_id }));

	function handlePrefetch(item: NotificationRes[number]) {
		const toPrefetch = searchPolisQueries.list(item.no_trx);
		const isCached = queryClient.getQueryData(toPrefetch.queryKey);
		if (!isCached) queryClient.prefetchQuery(toPrefetch);
	}

	function handleRefetch() {
		notifQuery.refetch();
		notifCountQuery.refetch();
	}

	function handleRedirect(item: NotificationRes[number]) {
		const toPrefetch = searchPolisQueries.list(item.no_trx);
		const data = queryClient.getQueryData(toPrefetch.queryKey)?.[0];
		if (!data) return;

		switch (data.kind) {
			case 'New Submission':
				goto(resolve('/(protected)/workbasket/new-submission/[caseID]', { caseID: String(data.case_id) }));
				break;
			case 'Further':
				goto(resolve('/(protected)/workbasket/further/[caseID]', { caseID: String(data.case_id) }));
				break;
			case 'Filling':
				goto(resolve('/(protected)/workbasket/filling/[caseID]', { caseID: String(data.case_id) }));
				break;
		}

		open = false;
		readNotifMutation.mutate({ noId: item.no_id }, { onSuccess: () => handleRefetch() });
	}

	function handleReadAll() {
		readAllNotifMutation.mutate(userStore.current!.lus_id, { onSuccess: () => handleRefetch() });
	}
</script>

<Button size="icon" variant="outline" class="relative" onclick={() => (open = true)}>
	<Bell />
	{#if notifCountQuery.data && notifCountQuery.data !== 0}
		<Badge class="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">
			{notifCountQuery.data > 99 ? '99+' : notifCountQuery.data}
		</Badge>
	{/if}
</Button>

{#if isDesktop.current}
	<Sheet.Root bind:open onOpenChange={() => handleRefetch()}>
		<Sheet.Content showCloseButton={false} class="top-1/2 right-2.5 h-[calc(100dvh-1.25rem)] -translate-y-1/2 gap-0 overflow-hidden rounded-lg border">
			<Sheet.Header class="border-b pb-2.5">
				<Sheet.Title class="flex items-center justify-between gap-2">
					<span>Notifications</span>
					{#if notifCountQuery.data !== 0}
						<Button size="sm" variant="ghost" class="font-normal text-muted-foreground" onclick={handleReadAll} disabled={readAllNotifMutation.isPending}>
							Read all
							{#if readAllNotifMutation.isPending}
								<LoaderCircle class="animate-spin" />
							{/if}
						</Button>
					{/if}
				</Sheet.Title>
			</Sheet.Header>
			{@render notificationItems()}
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content class="h-full">
			<Drawer.Header class="border-b">
				<Drawer.Title class="flex items-center justify-between gap-2">
					Notification
					{#if notifCountQuery.data !== 0}
						<Button size="sm" variant="ghost" class="font-normal text-muted-foreground" onclick={handleReadAll} disabled={readAllNotifMutation.isPending}>
							Read all
							{#if readAllNotifMutation.isPending}
								<LoaderCircle class="animate-spin" />
							{/if}
						</Button>
					{/if}
				</Drawer.Title>
			</Drawer.Header>
			{@render notificationItems()}
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#snippet notificationItems()}
	<div class="relative flex flex-1 flex-col overflow-y-auto">
		<div aria-hidden="true" class="sticky top-0 z-10 h-3.5 w-full shrink-0 bg-gradient-to-b from-background"></div>
		{#if notifQuery.data?.length}
			<ul class="-my-3.5 flex-1 divide-y">
				{#each notifQuery.data as notif, i (i)}
					<li>
						<button
							class={cn(
								'w-full cursor-pointer space-y-1 px-4 py-2 text-left text-sm opacity-100 transition-opacity hover:opacity-60 dark:hover:opacity-80',
								notif.status === 0 ? 'bg-muted' : ''
							)}
							onpointerenter={() => handlePrefetch(notif)}
							onclick={() => handleRedirect(notif)}
						>
							<div class="flex items-center justify-between gap-2">
								<p class="font-medium">{notif.jenis_trx} - {notif.no_trx}</p>
								<span class="flex items-center justify-between gap-1 text-right text-xs text-muted-foreground">
									<Clock size={12} />
									<time datetime={dayjs(notif.sent_date).toISOString()}>
										{formatNotificationDate(notif.sent_date)}
									</time>
								</span>
							</div>
							<span class="line-clamp-2 text-muted-foreground">
								{notif.message}
							</span>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="grid flex-1 place-items-center select-none">
				<div class="flex flex-col items-center justify-center gap-4">
					<img
						draggable={false}
						src={mode.current === 'light' ? '/empty-notification-light.svg ' : '/empty-notification-dark.svg'}
						alt="Empty Notification"
						class="w-1/4"
					/>
					<p class="text-sm text-muted-foreground">There are no notifications</p>
				</div>
			</div>
		{/if}
		<div aria-hidden="true" class="sticky bottom-0 z-10 h-3.5 w-full shrink-0 bg-gradient-to-t from-background"></div>
	</div>
{/snippet}
