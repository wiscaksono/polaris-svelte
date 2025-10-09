<script lang="ts">
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import { Pencil, Plus, Trash } from '@lucide/svelte';
	import { createQuery, createQueries } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { CreateFurther, UpdateFurther, DeleteFurther } from './actions/further';
	import { CreateFormSPM, UpdateFormSPM, DeleteFormSPM } from './actions/form-spm';

	import { furtherRequirementQueries, formSPMQueries } from './queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams, currentTaskFormTab } = getTaskFormContext();
	const furtherQuery = createQuery(() => furtherRequirementQueries.get({ regSpaj: taskFormParams.reg_spaj, caseId: taskFormParams.case_id }));

	const isContainMCU = $derived(!!furtherQuery.data?.map((item) => item.kategori).filter((item) => item.includes('MCU')).length);
	const formSPMQuery = createQuery(() => ({
		...formSPMQueries.get({ regSpaj: taskFormParams.reg_spaj, caseId: taskFormParams.case_id }),
		enabled: isContainMCU
	}));
	const tipeMedis = $derived(formSPMQuery.data?.map((item) => item.ket_medis) ?? []);
	const tipeMedisQueries = createQueries(() => ({
		queries: tipeMedis.map((tipe) => ({
			...formSPMQueries.detailMedis(tipe),
			enabled: isContainMCU && !!tipe
		})),
		combine: (res) => {
			const data = res.map(({ data }) => data);
			const isLoading = res.some(({ isLoading }) => isLoading);
			return { isLoading, data };
		}
	}));

	const isCurrentTabWorksheet = $derived(currentTaskFormTab.slug === 'worksheet');
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Further Requirements" />
	<InfoGroup.Content class="bg-background">
		<!-- Further Table -->
		<section class="space-y-2">
			<div class="flex items-center justify-between gap-2">
				<p class="truncate font-medium">Further Requirements</p>

				{#if !isCurrentTabWorksheet}
					{#if furtherQuery.data}
						<CreateFurther data={furtherQuery.data} />
					{:else}
						<Button class="!pl-2" disabled>
							<Plus />
							Add
						</Button>
					{/if}
				{/if}
			</div>
			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.Head>Tanggal Insert</Table.Head>
						<Table.Head>Kategori</Table.Head>
						<Table.Head>Remarks</Table.Head>
						<Table.Head>Completed</Table.Head>
						<Table.Head>Tanggal Completed</Table.Head>
						{#if currentTaskFormTab.slug !== 'worksheet'}
							<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								Action
							</Table.Head>
						{/if}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if furtherQuery.isPending || furtherQuery.isPlaceholderData}
						{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
							<Table.Row>
								<Table.Cell>
									<div class="h-4 w-28 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-4 w-38 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-4 w-20 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-4 w-10 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-4 w-28 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
									<Button variant="ghost" size="icon" class="size-6" disabled>
										<Pencil />
									</Button>
									<Button variant="ghost" size="icon" class="size-6" disabled>
										<Trash />
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					{:else if furtherQuery.isError}
						<Table.Row>
							<Table.Cell colspan={isCurrentTabWorksheet ? 5 : 6} class="text-center">Error: {furtherQuery.error.message}</Table.Cell>
						</Table.Row>
					{:else if furtherQuery.data.length}
						{#each furtherQuery.data as item, i (i)}
							<Table.Row>
								<Table.Cell>{dayjs(item.tglInsert).format('DD MMM YYYY, HH:mm')}</Table.Cell>
								<Table.Cell>{item.kategori}</Table.Cell>
								<Table.Cell>{item.remarks ?? '-'}</Table.Cell>
								<Table.Cell>{item.statusFurther === 'ACCEPT' || item.statusFurther === 'COMPLETED' ? 'Yes' : 'No'}</Table.Cell>
								<Table.Cell>{item.tglDecision ? dayjs(item.tglDecision).format('DD MMM YYYY, HH:mm') : '-'}</Table.Cell>
								{#if !isCurrentTabWorksheet}
									<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
										<UpdateFurther data={item} />
										<DeleteFurther data={item} />
									</Table.Cell>
								{/if}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={isCurrentTabWorksheet ? 5 : 6} class="h-16 text-center">No further requirement found</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</section>

		<!-- MCU Table -->
		{#if isContainMCU}
			<section class="space-y-2" transition:slide>
				<div class="flex items-center justify-between gap-2">
					<p class="font-medium">Form SPM</p>

					{#if !isCurrentTabWorksheet}
						{#if formSPMQuery.data}
							<CreateFormSPM initialData={formSPMQuery.data} />
						{:else}
							<Button class="!pl-2" disabled>
								<Plus />
								Add
							</Button>
						{/if}
					{/if}
				</div>
				<Table.Root variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.Head>Tanggal Insert</Table.Head>
							<Table.Head>Medis Untuk</Table.Head>
							<Table.Head>Nama</Table.Head>
							<Table.Head>Usia</Table.Head>
							<Table.Head>Jenis Kelamin</Table.Head>
							<Table.Head>Biaya Tanggung</Table.Head>
							<Table.Head>Tipe Medis</Table.Head>
							<Table.Head>Medis Lain</Table.Head>
							<Table.Head>Tanggal Update</Table.Head>
							<Table.Head>Completed</Table.Head>
							<Table.Head>Tanggal Completed</Table.Head>
							{#if !isCurrentTabWorksheet}
								<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
									Action
								</Table.Head>
							{/if}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if formSPMQuery.isPending || formSPMQuery.isPlaceholderData}
							{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
								<Table.Row>
									<Table.Cell>
										<div class="h-4 w-28 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-38 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-20 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-5 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-16 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-16 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-5 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-10 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-30 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-8 w-30 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="h-4 w-30 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</Table.Cell>
									{#if !isCurrentTabWorksheet}
										<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
											<Button variant="ghost" size="icon" class="size-6" disabled>
												<Pencil />
											</Button>
											<Button variant="ghost" size="icon" class="size-6" disabled>
												<Trash />
											</Button>
										</Table.Cell>
									{/if}
								</Table.Row>
							{/each}
						{:else if formSPMQuery.isError}
							<Table.Row>
								<Table.Cell colspan={isCurrentTabWorksheet ? 10 : 11} class="text-center">Error: {formSPMQuery.error.message}</Table.Cell>
							</Table.Row>
						{:else if formSPMQuery.data?.length}
							{#each formSPMQuery.data as item, i (i)}
								<Table.Row>
									<Table.Cell>
										{item.tglInsert ? dayjs(item.tglInsert).format('DD MMM YYYY, HH:mm') : '-'}
									</Table.Cell>
									<Table.Cell>
										{item.medisUntuk}
									</Table.Cell>
									<Table.Cell>
										{item.nama_pp}
									</Table.Cell>
									<Table.Cell>
										{item.usia}
									</Table.Cell>
									<Table.Cell>
										{item.jenis_kelamin}
									</Table.Cell>
									<Table.Cell>
										{item.biaya_tanggung}
									</Table.Cell>
									<Table.Cell>
										{item.ket_medis ?? '-'}
									</Table.Cell>
									<Table.Cell>
										{#if item.detailTambahan.length}
											{#if item.detailTambahan.length === 1}
												{item.detailTambahan[0].namaMedis}
											{:else if item.detailTambahan.length > 1}
												{item.detailTambahan[0].namaMedis}
												<Tooltip.Root>
													<Tooltip.Trigger>
														<Badge variant="outline" class="ml-2 pl-1.5">
															+{item.detailTambahan.length - 1} more
														</Badge>
													</Tooltip.Trigger>
													<Tooltip.Content>
														<ul class="list-inside list-disc">
															{#each item.detailTambahan.slice(1) as tambahan, i (i)}
																<li>{tambahan.namaMedis}</li>
															{/each}
														</ul>
													</Tooltip.Content>
												</Tooltip.Root>
											{/if}
										{:else}
											-
										{/if}
									</Table.Cell>
									<Table.Cell>
										{#if !isCurrentTabWorksheet}
											<Input class="h-8 w-full" type="date" value={dayjs(item.tgl_update).format('YYYY-MM-DD')} />
										{:else}
											{item.tgl_update ? dayjs(item.tgl_update).format('DD MMM YYYY, HH:mm') : '-'}
										{/if}
									</Table.Cell>
									<Table.Cell>
										{#if !isCurrentTabWorksheet}
											<Select.Root type="single">
												<Select.Trigger class="w-full" size="sm">
													{item.status}
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="Yes">Yes</Select.Item>
													<Select.Item value="No">No</Select.Item>
												</Select.Content>
											</Select.Root>
										{:else}
											{item.status}
										{/if}
									</Table.Cell>
									<Table.Cell>
										{item.tgl_completed ? dayjs(item.tgl_completed).format('DD MMM YYYY, HH:mm') : '-'}
									</Table.Cell>
									{#if !isCurrentTabWorksheet}
										<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
											<UpdateFormSPM data={item} initialData={formSPMQuery.data} />
											<DeleteFormSPM data={item} initialData={formSPMQuery.data} />
										</Table.Cell>
									{/if}
								</Table.Row>
								<Table.Row>
									<Table.Cell colspan={4} class="h-px p-0">
										<div class="flex h-full flex-col border-l-4 border-destructive">
											<div class="space-y-1 px-4 py-2">
												<p class="border-b pb-1 font-medium">Tipe Medis {item.ket_medis ? `(${item.ket_medis})` : ''}</p>
												{#if tipeMedisQueries.data?.length && tipeMedisQueries.data[i]?.length}
													<ul class="flex-1 list-inside list-disc" transition:slide>
														{#each tipeMedisQueries.data[i] as medis, i (i)}
															<li class="text-muted-foreground">{medis}</li>
														{/each}
													</ul>
												{:else}
													<p class="text-muted-foreground">Tidak ada data</p>
												{/if}
											</div>
										</div>
									</Table.Cell>
									<Table.Cell colspan={isCurrentTabWorksheet ? 7 : 8} class="h-px p-0">
										<div class="flex h-full flex-col border-l-4 border-info">
											<div class="space-y-1 px-4 py-2">
												<p class="border-b pb-1 font-medium">PEMERIKSAAN TAMBAHAN</p>
												<ul class="flex-1 list-inside list-disc">
													{#if item.detailTambahan.length}
														{#each item.detailTambahan as tambahan, i (i)}
															<li class="text-muted-foreground">{tambahan.namaMedis}</li>
														{/each}
													{:else}
														<li class="text-muted-foreground">Tidak ada data</li>
													{/if}
												</ul>
											</div>
										</div>
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={12} class="h-16 text-center">No form SPM found</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</section>
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
