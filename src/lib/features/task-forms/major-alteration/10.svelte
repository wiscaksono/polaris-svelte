<script lang="ts">
	import FurtherRequirement from '$lib/features/task-forms/components/akseptasi/further-requirement';
	import HistoryEskalasiKeTL from '$lib/features/task-forms/components/akseptasi/history-eskalasi-ke-tl';
	import DecisionPerProduct from '$lib/features/task-forms/components/akseptasi/decision-per-product';

	import Approve from '../components/actions/approve';
	import Pending from '../components/actions/pending';
	import CancelTicket from '../components/actions/cancel-ticket';
	import EskalasiKeTL from '../components/actions/eskalasi-ke-tl';
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
		<EskalasiKeTL />
		<Approve />
		<Pending />
		<CancelTicket />
	</div>
	<FurtherRequirement />
	<HistoryEskalasiKeTL />
	<DecisionPerProduct />
</div>
