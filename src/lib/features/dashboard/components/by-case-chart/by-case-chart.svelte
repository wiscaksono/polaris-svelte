<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import ByDistributionChannelChart from './by-distribution-channel-chart.svelte';
	import ByJenisTransaksiChart from './by-jenis-transaksi-chart.svelte';

	let activeView = $state<string>('NEW CASE');
</script>

<Card.Root class="col-span-4 flex flex-col gap-0 rounded-none border-0 py-0 shadow-none">
	<Card.Header class="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
		<div class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
			<Card.Title>Total Case Difference</Card.Title>
			<Card.Description>Perbandingan total case dengan bulan lalu</Card.Description>
		</div>
		<div class="flex">
			{#each ['New', 'Pending'] as view (view)}
				<button
					data-active={activeView === view}
					class="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
					onclick={() => (activeView = view)}
				>
					<span class="text-lg leading-none font-bold sm:text-3xl">
						{view}
					</span>
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="grid grid-cols-2 gap-px bg-border p-0">
		<ByDistributionChannelChart />
		<ByJenisTransaksiChart />
	</Card.Content>
</Card.Root>
