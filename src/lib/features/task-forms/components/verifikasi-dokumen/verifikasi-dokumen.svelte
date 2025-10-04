<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';

	import { getTaskFormContext } from '../../context';
	import { verifikasiDokumenQueries } from './queries';

	import Upload from './actions/upload.svelte';
	import Previewer from './previewer.svelte';

	const { taskFormParams } = getTaskFormContext();

	const listDocumentQuery = createQuery(() => verifikasiDokumenQueries.listDocument({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Verifikasi Dokumen">
		{#snippet rightChild()}
			<Upload />
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content wrapperClassName="grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-2 space-y-0 bg-background">
		{#if listDocumentQuery.data}
			{#each listDocumentQuery.data as item (item.ID)}
				<Previewer data={item} />
			{/each}
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
