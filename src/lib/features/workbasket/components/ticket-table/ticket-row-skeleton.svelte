<script lang="ts">
	import { Flag } from '@lucide/svelte';

	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	let { index }: { index: number } = $props();
</script>

<Table.RowSkeleton class="animate-pulse" style="animation-delay: {index * 0.1}s">
	<Table.CellSkeleton>
		<Button size="icon" variant="ghost" class="size-6 hover:border" disabled>
			<Flag />
		</Button>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-10 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="flex items-center">
			<div class="h-5 w-40 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
			<div class="h-5 w-16 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-40 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="h-5 w-16 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-29 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="h-5 w-16 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-29 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="h-5 w-36 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-8 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="h-5 w-10 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-28 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
		<div class="h-5 w-40 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
	<Table.CellSkeleton>
		<div class="h-5 w-15 p-px">
			<div class="h-full w-full rounded bg-muted"></div>
		</div>
	</Table.CellSkeleton>
</Table.RowSkeleton>
