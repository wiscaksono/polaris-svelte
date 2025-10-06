<script lang="ts">
	import dayjs from 'dayjs';
	import { mode } from 'mode-watcher';
	import { createQuery } from '@tanstack/svelte-query';
	import { EllipsisVertical, LoaderCircle } from '@lucide/svelte';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { verifikasiDokumenQueries } from './queries';

	import type { VerifikasiDokumenListDocument } from './type';

	let { data }: { data: VerifikasiDokumenListDocument[number] } = $props();

	const documentQuery = createQuery(() => verifikasiDokumenQueries.viewDocument(data.ID));

	let thumbnailUrl = $state('');
	let previewUrl = $state<string | null>(null);

	$effect(() => {
		if (!documentQuery.data) return;

		if (documentQuery.data.contentType?.startsWith('application/pdf')) {
			thumbnailUrl = mode.current === 'dark' ? '/pdf-placeholder-dark.png' : '/pdf-placeholder-light.png';
			previewUrl = URL.createObjectURL(documentQuery.data.blob);
		} else if (documentQuery.data.contentType?.startsWith('image/')) {
			thumbnailUrl = URL.createObjectURL(documentQuery.data.blob);
		} else if (documentQuery.data.contentType?.startsWith('application/json')) {
			thumbnailUrl = mode.current === 'dark' ? '/broken-file-dark.png' : '/broken-file-light.png';
			previewUrl = null;
		}

		return () => {
			URL.revokeObjectURL(thumbnailUrl);
			thumbnailUrl = '';
		};
	});
</script>

<Dialog.Root>
	<Dialog.Trigger disabled={previewUrl === null}>
		{#snippet child({ props })}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div {...props} class="flex shrink-0 flex-col divide-y overflow-hidden rounded border bg-muted hover:opacity-90" aria-label={data.JENIS_DOC} tabindex="0">
				{#if documentQuery.data}
					<img src={thumbnailUrl} class="aspect-square h-full w-full object-cover" alt={data.JENIS_DOC} />
				{:else}
					<div class="aspect-square h-full w-full bg-muted"></div>
				{/if}
				<div class="flex items-center justify-between bg-background p-1.5">
					<div>
						<p class="line-clamp-1 text-sm">{data.JENIS_DOC}</p>
						<p class="line-clamp-1 text-xs text-muted-foreground">{dayjs(data.CREATED_DATE).format('DD MMM YYYY, HH:mm')}</p>
					</div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="ghost" size="icon" class="size-6 rounded">
									<EllipsisVertical />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Label>Actions</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<Update {data} />
								<DropdownMenu.Separator />
								<Delete idDoc={data.ID_DOC} />
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		{/snippet}
	</Dialog.Trigger>

	<!-- Preview Dialog -->
	<Dialog.Content
		showCloseButton={false}
		onOpenAutoFocus={(e) => e.preventDefault()}
		overlayProps={{ class: 'backdrop-blur' }}
		trapFocus={false}
		class="!max-h-max !max-w-max items-center justify-center overflow-y-auto rounded-none border-0 bg-transparent p-0 shadow-none"
	>
		{#if documentQuery.data}
			{#if documentQuery.data.contentType?.startsWith('application/pdf')}
				<iframe src={previewUrl} class="h-[80dvh] w-[80dvw] rounded-lg" title={data.JENIS_DOC}></iframe>
			{:else}
				<img src={thumbnailUrl} alt={data.JENIS_DOC} class="object-fit h-full !max-h-[80dvh] w-full !max-w-[80dvw] rounded-lg" />
			{/if}
		{:else}
			<div class="flex size-20 items-center justify-center">
				<LoaderCircle class="size-10 animate-spin" />
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
