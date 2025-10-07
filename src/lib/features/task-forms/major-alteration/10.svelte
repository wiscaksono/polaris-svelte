<script lang="ts">
	import FurtherRequirement from '$lib/features/task-forms/components/akseptasi/further-requirement';
	import HistoryEskalasiKeTL from '$lib/features/task-forms/components/akseptasi/history-eskalasi-ke-tl';
	import DecisionPerProduct from '$lib/features/task-forms/components/akseptasi/decision-per-product';

	import CancelTicket from '../components/actions/cancel-ticket';
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2">
		<CancelTicket />
	</div>
	<FurtherRequirement />
	<HistoryEskalasiKeTL />
	<DecisionPerProduct />
</div>
