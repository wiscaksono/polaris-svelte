<script lang="ts">
	import AlertIsReunderwriting from '$lib/features/task-forms/components/alert-is-reunderwriting';
	import FurtherRequirement from '$lib/features/task-forms/components/akseptasi/further-requirement';
	import HistoryEskalasiKeTL from '$lib/features/task-forms/components/akseptasi/history-eskalasi-ke-tl';
	import DecisionPerProduct from '$lib/features/task-forms/components/akseptasi/decision-per-product';

	import Approve from '../components/actions/approve';
	import Pending from '../components/actions/pending';
	import CancelTicket from '../components/actions/cancel-ticket';
	import EskalasiKeTL from '../components/actions/eskalasi-ke-tl';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { currentTaskFormTab } = getTaskFormContext();
</script>

<AlertIsReunderwriting />
<div class="space-y-2">
	{#if currentTaskFormTab.slug !== 'worksheet'}
		<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
			<EskalasiKeTL />
			<Approve />
			<Pending />
			<CancelTicket />
		</div>
	{/if}
	<FurtherRequirement />
	{#if currentTaskFormTab.slug !== 'worksheet'}
		<HistoryEskalasiKeTL />
	{/if}
	<DecisionPerProduct />
</div>
