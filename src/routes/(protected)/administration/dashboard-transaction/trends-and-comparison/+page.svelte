<script lang="ts">
	import ProcessingStageComparison from '$lib/features/dashboard-transactions/components/trends-and-comparison/processing-stage-comparison.svelte';
	import IssueDistribution from '$lib/features/dashboard-transactions/components/trends-and-comparison/issue-distribution.svelte';
	import MonthlyPerformanceComparison from '$lib/features/dashboard-transactions/components/trends-and-comparison/monthly-performance-comparison.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="grid grid-cols-2 !divide-x">
	<ProcessingStageComparison data={data.transactionData.trendsAndComparison.stage} />
	<IssueDistribution data={data.transactionData.trendsAndComparison.issue} />
</div>
<MonthlyPerformanceComparison data={data.transactionData.trendsAndComparison.monthly} />
