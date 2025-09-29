<script lang="ts">
	import AverageTimePerTransactionType from '$lib/features/dashboard-transactions/components/transaction-type/average-time-per-transaction-type.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<AverageTimePerTransactionType data={data.transactionData.transactionType.average} />
