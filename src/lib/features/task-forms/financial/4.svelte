<script lang="ts">
	import DataInvestasiPolis from '../components/data-investasi-polis';
	import SuspendedPremium from '../components/suspended-premium';
	import RedemptionInstruction from '../components/redemption-instruction';
	import Biaya from '../components/biaya';
	import ViewBilling from '../components/view-billing';
	import PengembalianNilaiPolis from '../components/pengembalian-nilai-polis';
	import DataNilaiTunai from '../components/data-nilai-tunai';

	import Realokasi from '../components/actions/realokasi';
	import Redemption from '../components/actions/redemption';
	import ChangeStatus from '../components/actions/change-status';

	import { getTaskFormContext } from '../context.svelte';
	import type { TransactionType } from '$lib/utils/type';

	const { taskFormParams, currentTaskFormTab } = getTaskFormContext();

	const excludedChangeStatusTrx: TransactionType[] = ['Switching', 'Switching and Redirection', 'Redirection', 'Withdrawal'];
</script>

<div class="space-y-2">
	{#if currentTaskFormTab.slug === 'data-investasi'}
		<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
			{#if !excludedChangeStatusTrx.includes(taskFormParams.case_trx)}
				<ChangeStatus />
				<Redemption />
				<Realokasi />
			{/if}
		</div>
		<div class="space-y-2">
			<DataInvestasiPolis />
			<SuspendedPremium />
			<RedemptionInstruction />
			<Biaya />
		</div>
	{:else if currentTaskFormTab.slug === 'data-nilai-tunai'}
		<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
			<ChangeStatus />
		</div>
		<div class="space-y-2">
			<DataNilaiTunai />
			<PengembalianNilaiPolis />
			<Biaya />
			<ViewBilling />
		</div>
	{/if}
</div>
