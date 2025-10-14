<script lang="ts">
	import dayjs from 'dayjs';
	import { X, Check } from '@lucide/svelte';

	import Badge from '$lib/components/ui/badge/badge.svelte';
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

{#if data.length}
	{#each data as item, i (i)}
		<div class="space-y-2 rounded-lg border p-2 shadow-xs">
			<div class="flex w-full items-center justify-between gap-2 overflow-hidden">
				<div class="flex items-center gap-4">
					<div class="flex shrink-0 items-center gap-1">
						<p class="text-xs font-medium">Tanggal:</p>
						<p class="text-xs text-muted-foreground">{dayjs(item.tanggal).format('DD MMM YYYY')}</p>
					</div>
					<div class="flex shrink-0 items-center gap-1">
						<p class="text-xs font-medium">SPICA ke:</p>
						<p class="text-xs text-muted-foreground">{item.spica_ke}</p>
					</div>
					<div class="flex min-w-0 flex-1 items-center gap-1">
						<p class="shrink-0 text-xs font-medium">Rule Name:</p>
						<p class="truncate text-xs text-muted-foreground">
							{item.rule_name}
						</p>
					</div>
				</div>
				<Badge variant={item.result === 'Passed' || item.result === 'Skip' ? 'success-outline' : 'destructive-outline'} class="shrink-0 pl-1">
					{#if item.result === 'Passed' || item.result === 'Skip'}
						<Check />
					{:else}
						<X />
					{/if}
					{item.result}
				</Badge>
			</div>
			<div class="rounded-sm bg-muted p-2 text-xs">
				{item.deskripsi}
			</div>
		</div>
	{/each}
{/if}
