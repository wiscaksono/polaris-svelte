<script lang="ts">
	import dayjs from 'dayjs';
	import { X, Check } from '@lucide/svelte';

	import * as Table from '$lib/components/ui/table';

	import type { SpicaResultRes } from '../type';

	interface Props {
		data: SpicaResultRes;
		isLoading: boolean;
		isError: boolean;
		perPage: number;
		errorMessage?: string;
	}

	let { data, isLoading, isError, perPage, errorMessage = 'Unknown Error' }: Props = $props();
</script>

<Table.Root variant="outline">
	<Table.Header>
		<Table.Row>
			<Table.Head>Tanggal</Table.Head>
			<Table.Head>Spica Ke</Table.Head>
			<Table.Head>Rule Name</Table.Head>
			<Table.Head>Deskripsi Rule</Table.Head>
			<Table.Head>Keterangan Proses</Table.Head>
			<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
				Status
			</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if isLoading}
			{#each Array.from({ length: perPage }, (_, i) => i) as i (i)}
				<Table.Row>
					<Table.Cell>
						<div class="h-4 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="grid place-items-center">
							<div class="h-4 w-4 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-4 w-60 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-4 w-60 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="grid place-items-center">
							<div class="h-4 w-20 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</div>
					</Table.Cell>
					<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						<div class="grid place-items-center">
							<div class="h-6 w-6 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else if isError}
			<Table.Row>
				<Table.Cell colspan={6} class="h-16 text-center">
					{errorMessage}
				</Table.Cell>
			</Table.Row>
		{:else if data.length}
			{#each data as item, i (i)}
				<Table.Row>
					<Table.Cell>{dayjs(item.tanggal).format('DD MMM YYYY')}</Table.Cell>
					<Table.Cell class="text-center">{item.spica_ke}</Table.Cell>
					<Table.Cell>{item.rule_name}</Table.Cell>
					<Table.Cell>{item.deskripsi}</Table.Cell>
					<Table.Cell class="text-center">{item.result}</Table.Cell>
					<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						<div class="grid place-items-center">
							{#if item.result === 'Passed' || item.result === 'Skip'}
								<Check class="text-success" />
							{:else}
								<X class="text-destructive" />
							{/if}
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={6} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
