<script lang="ts">
	import TabTwo from './2.svelte';
	import TabThree from './3.svelte';
	import TabFour from './4.svelte';
	import TabFive from './5.svelte';
	import TabEight from './8.svelte';
	import TabTen from './10.svelte';

	import Approver from '../components/approver';
	import HistoryApproval from '../components/history-approval';
	import UnderwrittingNote from '../components/underwritting-note';
	import DecisionFinalMajorAlteration from '../components/decision-final-major-alteration';
</script>

<div class="space-y-2">
	<TabTwo />
	<TabThree />
	<TabFour />
	<TabFive />
	<TabEight />
	<TabTen />
	<UnderwrittingNote />
	<DecisionFinalMajorAlteration />
	<Approver />
	<HistoryApproval />
</div>
