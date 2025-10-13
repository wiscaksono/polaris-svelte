<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert, Pencil } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import Button from '$lib/components/ui/button/button.svelte';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import Update from './actions/update.svelte';

	import { financialQueries } from '../../queries/financial';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams, currentTaskFormTab } = getTaskFormContext();

	const query = createQuery(() => financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, type: '3' }));

	const diffMap = $derived([
		{ label: 'Nama Pemilik Rekening', before: query.data?.endorsement?.before.accountHolderName, after: query.data?.endorsement?.after.accountHolderName },
		{ label: 'Nomor Rekening', before: query.data?.endorsement?.before.accountNumber, after: query.data?.endorsement?.after.accountNumber },
		{ label: 'Nama Bank', before: query.data?.endorsement?.before.bankName, after: query.data?.endorsement?.after.bankName },
		{ label: 'Mata Uang', before: query.data?.endorsement?.before.currency, after: query.data?.endorsement?.after.currency },
		{ label: 'Nomor HP', before: query.data?.endorsement?.before.phoneNumber, after: query.data?.endorsement?.after.phoneNumber },
		{ label: 'Email', before: query.data?.endorsement?.before.email, after: query.data?.endorsement?.after.email }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Pengkinian Data">
		{#snippet rightChild()}
			{@const somethingChanged = !deepEqual(query.data?.endorsement.before, query.data?.endorsement.after)}
			{#if somethingChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}
			{#if currentTaskFormTab.slug !== 'worksheet'}
				{#if query.data}
					<Update data={query.data} />
				{:else}
					<Button variant="ghost" size="icon" class="size-6" disabled>
						<Pencil />
					</Button>
				{/if}
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={query.isLoading} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
