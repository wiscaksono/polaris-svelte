<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { historyPerubahanRekeningManfaatQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => historyPerubahanRekeningManfaatQueries.get({ regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="History Perubahan Rekening Manfaat" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Tgl Changes</Table.Head>
					<Table.Head>Bank</Table.Head>
					<Table.Head>Cabang</Table.Head>
					<Table.Head>Kota</Table.Head>
					<Table.Head>Nomor Rekening</Table.Head>
					<Table.Head>Atas Nama</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					<!-- TODO: Add loader -->
					Loading
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={8} class="h-16 text-center">{query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.tglChanges ? dayjs(item.tglChanges).format('DD MMM YYYY') : '-'}</Table.Cell>
							<Table.Cell>{item.bank ?? '-'}</Table.Cell>
							<Table.Cell>{item.cabang ?? '-'}</Table.Cell>
							<Table.Cell>{item.kota ?? '-'}</Table.Cell>
							<Table.Cell>{item.norek ?? '-'}</Table.Cell>
							<Table.Cell>{item.atasNama ?? '-'}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
