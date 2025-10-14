<script lang="ts">
	import DataInvestasiPolis from '../components/data-investasi-polis';
	import SuspendedPremium from '../components/suspended-premium';
	import RedemptionInstruction from '../components/redemption-instruction';
	import Biaya from '../components/biaya';

	import Realokasi from '../components/actions/realokasi';
	import Redemption from '../components/actions/redemption';
	import ChangeStatus from '../components/actions/change-status';
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
		<ChangeStatus />
		<Redemption />
		<Realokasi />
	</div>
	<div class="space-y-2">
		<DataInvestasiPolis />
		<SuspendedPremium />
		<RedemptionInstruction />
		<Biaya />
	</div>
</div>
