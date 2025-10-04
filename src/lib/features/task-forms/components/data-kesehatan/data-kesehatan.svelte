<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { dataKesehatanQueries } from './query';

	import { getTaskFormContext } from '../../context';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';

	import type { DataKesehatanRes } from './type';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataKesehatanQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Pernyataan Kesehatan" />
	<InfoGroup.Content class={`${!query.data?.length ? 'bg-background' : ''}`}>
		{#if query.data?.length}
			{#each query.data as item, i (i)}
				<InfoGroup.Root>
					<InfoGroup.Trigger title={item.title} />
					<InfoGroup.Content class="bg-background" wrapperClassName="divide-y">
						{#each item.list_peserta as peserta, j (j)}
							<div class="space-y-2 not-last:pb-2">
								<p class="font-medium">{peserta.name}</p>
								<Table.Root variant="outline">
									<Table.Header>
										<Table.Row>
											<Table.Head class="sticky left-0 z-20 w-10 !bg-background text-center" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
												No
											</Table.Head>
											<Table.Head>Pertanyaan</Table.Head>
											<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
												Jawaban
											</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each item.list_pertanyaan as pertanyaan, k (k)}
											<Table.Row>
												<Table.Cell
													class="sticky left-0 z-20 w-10 !bg-background text-center"
													style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset"
												>
													{pertanyaan.number}
												</Table.Cell>
												<!-- eslint-disable-next-line svelte/no-at-html-tags -->
												<Table.Cell>{@html pertanyaan.question}</Table.Cell>
												<Table.Cell
													class="sticky right-0 z-20 w-40 !bg-background text-center"
													style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset"
												>
													{@render answerRenderer(peserta.jawaban[k])}
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						{/each}
					</InfoGroup.Content>
				</InfoGroup.Root>
			{/each}
		{:else}
			<div class="grid h-16 place-items-center">
				<p class="text-center">No Data</p>
			</div>
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>

{#snippet answerRenderer(answer: DataKesehatanRes['data_kesehatan'][number]['list_peserta'][number]['jawaban'][number] | undefined)}
	{#if answer?.type}
		{#if answer.type === 'text'}
			{answer.value}
		{:else if answer.type === 'options'}
			{#if answer.value[0] === '1'}
				Yes
			{:else}
				No
			{/if}
		{/if}
	{:else}
		-
	{/if}
{/snippet}
