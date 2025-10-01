<script lang="ts">
	import { Pencil } from '@lucide/svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { DataPPdanTURes } from '../../type';

	let { data }: { data?: DataPPdanTURes['pemegangPolis']['dataDiri'] } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline" size="icon">
			<Pencil />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Data Diri Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div>
			<div class="space-y-2">
				<Label for="nama-lengkap">Nama Lengkap</Label>
				<Input id="nama-lengkap" type="text" placeholder="Nama Lengkap" value={data?.after.namaLengkap} disabled />
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
