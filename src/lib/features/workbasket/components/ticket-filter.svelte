<script lang="ts" module>
	import { parseAsString } from 'nuqs-svelte';

	export const ticketFilterParams = {
		caseTrx: parseAsString.withDefault(''), // caseTrx
		user: parseAsString.withDefault(''), // lusUser
		noPolis: parseAsString.withDefault(''), // noPolis
		noTmp: parseAsString.withDefault(''), // noTmp
		from: parseAsString.withDefault(''), // startDate
		until: parseAsString.withDefault('') // endDate
	};
</script>

<script lang="ts">
	import { ListFilter } from '@lucide/svelte';
	import { useQueryStates } from 'nuqs-svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import { toTitleCase } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { commonQueries } from '$lib/queries';
	import { userStore } from '$lib/stores';

	const isAdmin = userStore.current!.role_name === 'POLARIS Admin';

	const queryParams = useQueryStates(ticketFilterParams);
	const listUserQuery = createQuery(() => ({ ...commonQueries.listUser(), enabled: isAdmin }));
	const listTransactionQuery = createQuery(() => commonQueries.listTransaction());

	let open = $state(false);
	let localParams = $state({
		caseTrx: queryParams.caseTrx.current,
		user: queryParams.user.current,
		noPolis: queryParams.noPolis.current,
		noTmp: queryParams.noTmp.current,
		from: queryParams.from.current,
		until: queryParams.until.current
	});

	const isFiltered = $derived(
		Object.values(queryParams).some((value) => {
			if ('current' in value) return value.current !== '';
		})
	);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		queryParams.set(localParams);

		open = false;
	}

	function handleReset(event: Event) {
		event.preventDefault();
		const defaultParams = {
			caseTrx: '',
			user: '',
			noPolis: '',
			noTmp: '',
			from: '',
			until: ''
		};

		localParams = defaultParams;
		queryParams.set(defaultParams);

		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				aria-label="Filter"
				class={`absolute top-1/2 right-3 size-6 -translate-y-1/2 rounded-sm text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-accent/50 ${isFiltered && 'bg-accent text-accent-foreground'}`}
				variant="ghost"
				size="icon"
			>
				<ListFilter class="size-4" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end" sideOffset={14} alignOffset={-14} class="w-[500px]">
		<form onsubmit={handleSubmit} onreset={handleReset} data-testid="ticket-filter-form" class="space-y-3">
			<div class="grid grid-cols-3 items-center gap-4">
				<Label for="jenis-transaksi">Jenis Transaksi</Label>
				<Select.Root type="single" bind:value={localParams.caseTrx}>
					<Select.Trigger id="jenis-transaksi" data-testid="select-jenis-transaksi" class="col-span-2 w-full">
						{localParams.caseTrx}
					</Select.Trigger>
					<Select.Content align="end">
						{#if listTransactionQuery.data}
							{#each listTransactionQuery.data as item, i (i)}
								<Select.Item value={item.DESCRIPTION}>{item.DESCRIPTION}</Select.Item>
							{/each}
						{:else}
							<Select.Item value="loading">Loading...</Select.Item>
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-3 items-center gap-4">
				<Label for="nomor-polis">No. Polis</Label>
				<Input id="nomor-polis" data-testid="input-nomor-polis" class="col-span-2 w-full" bind:value={localParams.noPolis} />
			</div>
			<div class="grid grid-cols-3 items-center gap-4">
				<Label for="nomor-temp">No. Temp</Label>
				<Input id="nomor-temp" data-testid="input-no-temp" class="col-span-2 w-full" bind:value={localParams.noTmp} />
			</div>
			<div class="grid grid-cols-3 items-center gap-4">
				<Label for="start-at">Created At</Label>
				<Input id="start-at" data-testid="input-start-at" class="w-full" type="date" bind:value={localParams.from} />
				<Input id="end-at" data-testid="input-end-at" class="w-full" type="date" bind:value={localParams.until} />
			</div>
			{#if isAdmin}
				<div class="grid grid-cols-3 items-center gap-4">
					<Label for="user-assign">User Assign</Label>
					<Select.Root type="single" bind:value={localParams.user}>
						<Select.Trigger id="user-assign" data-testid="select-user-assign" class="col-span-2 w-full">
							{#if listUserQuery.data}
								{toTitleCase(listUserQuery.data.find((item) => String(item.LUS_ID) === localParams.user)?.LUS_FULL_NAME ?? '')}
							{/if}
						</Select.Trigger>
						<Select.Content align="end">
							{#if listUserQuery.data}
								{#each listUserQuery.data as item, i (i)}
									<Select.Item value={String(item.LUS_ID)}>{toTitleCase(item.LUS_FULL_NAME)}</Select.Item>
								{/each}
							{:else}
								<Select.Item value="loading">Loading...</Select.Item>
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}
			<div class="ml-auto flex items-center gap-2">
				<Button type="submit" class="ml-auto" variant="outline" data-testid="button-filter">Filter</Button>
				<Button type="reset" variant="outline" data-testid="button-reset">Reset</Button>
			</div>
		</form>
	</Popover.Content>
</Popover.Root>
