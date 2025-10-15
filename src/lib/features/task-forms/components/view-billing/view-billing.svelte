<script lang="ts">
	import { PUBLIC_BASE_ALCOR_WEB_URL } from '$env/static/public';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="View Billing" />
	<InfoGroup.Content class="bg-background" wrapperClassName="p-0">
		<iframe title="Instruksi Bayar" src={`${PUBLIC_BASE_ALCOR_WEB_URL}/view-billing?docNo=${taskFormParams.nopol}&isExternal=true`} class="h-[70dvh] w-full"
		></iframe>
	</InfoGroup.Content>
</InfoGroup.Root>
