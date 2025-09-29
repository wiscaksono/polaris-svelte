<script lang="ts">
	import HourlyProcessingTimeHeatmap from '$lib/features/dashboard-transactions/components/processing-time/hourly-processing-time-heatmap.svelte';
	import AverageTimePerProcessingStage from '$lib/features/dashboard-transactions/components/processing-time/average-time-per-processing-stage.svelte';
	import OverallProcessingTimeTrend from '$lib/features/dashboard-transactions/components/processing-time/overall-processing-time-trend.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HourlyProcessingTimeHeatmap data={data.transactionData.processingTime.heatmap} />
<AverageTimePerProcessingStage data={data.transactionData.processingTime.average} />
<OverallProcessingTimeTrend data={data.transactionData.processingTime.trend} />
