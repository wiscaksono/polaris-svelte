<script lang="ts">
	import * as InfoGroup from '$lib/components/ui/info-group';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const url = `https://alcor-web-sandbox.sinarmasmsiglife.co.id/payment-request/detail/${taskFormParams.no_trx}`;
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Instruksi Bayar" />
	<InfoGroup.Content class="bg-background" wrapperClassName="p-0">
		<iframe title="Instruksi Bayar" src={url} class="h-[70dvh] w-full"></iframe>
	</InfoGroup.Content>
</InfoGroup.Root>
