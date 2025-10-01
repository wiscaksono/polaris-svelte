<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Heading from '$lib/components/heading.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { dataPolisQueries } from '$lib/features/data-polis/queries';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = createQuery(() => dataPolisQueries.dueDiligence(regSpaj));
</script>

<section>
	<Heading title="Due Diligence" description="Due diligence data for client background and risk assessment." />
	<Table.Root variant="outline">
		<Table.Header class="sticky top-0 z-10 bg-background">
			<Table.Row>
				<Table.Head>Client</Table.Head>
				<Table.Head>CIF</Table.Head>
				<Table.Head>Nama</Table.Head>
				<Table.Head>Pekerjaan</Table.Head>
				<Table.Head>Rincian Pekerjaan</Table.Head>
				<Table.Head>Warga Negara</Table.Head>
				<Table.Head>Kategori High Risk Customer</Table.Head>
				<Table.Head>Remarks High Risk Customer</Table.Head>
				<Table.Head>Kategori Politically Exposed Person</Table.Head>
				<Table.Head>Remarks Politically Exposed Person</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if query.isLoading}
				{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
					<Table.Row>
						<Table.Cell>
							<div class="h-5 w-26 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-32 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-20 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-10 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else if query.data}
				{#each query.data.Pemegang_Polis as item, i (i)}
					<Table.Row>
						<Table.Cell>{item.client}</Table.Cell>
						<Table.Cell>{item.cif ?? '-'}</Table.Cell>
						<Table.Cell>{item.nama}</Table.Cell>
						<Table.Cell>{item.pekerjaan}</Table.Cell>
						<Table.Cell>{item.rincianPekerjaan}</Table.Cell>
						<Table.Cell>{item.negara}</Table.Cell>
						<Table.Cell>{item.riskCustomer}</Table.Cell>
						<Table.Cell>{item.remarkRisk}</Table.Cell>
						<Table.Cell>{item.politicalExpose}</Table.Cell>
						<Table.Cell>{item.remarkPoliticalExpose}</Table.Cell>
					</Table.Row>
				{/each}
				{#each query.data.Tertanggung_Utama as item, i (i)}
					<Table.Row>
						<Table.Cell>{item.client}</Table.Cell>
						<Table.Cell>{item.cif ?? '-'}</Table.Cell>
						<Table.Cell>{item.nama}</Table.Cell>
						<Table.Cell>{item.pekerjaan}</Table.Cell>
						<Table.Cell>{item.rincianPekerjaan}</Table.Cell>
						<Table.Cell>{item.negara}</Table.Cell>
						<Table.Cell>{item.riskCustomer}</Table.Cell>
						<Table.Cell>{item.remarkRisk}</Table.Cell>
						<Table.Cell>{item.politicalExpose}</Table.Cell>
						<Table.Cell>{item.remarkPoliticalExpose}</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={9} class="h-16 text-center">No data found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
