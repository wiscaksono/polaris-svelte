<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	import type { CreateBaseQueryResult } from '@tanstack/svelte-query';
	import type { MajorAlterationTab1Res } from '../../major-alteration/type';

	let { query }: { query: CreateBaseQueryResult<MajorAlterationTab1Res, Error> } = $props();
</script>

<section class="space-y-4">
	<div class="relative mb-3.5">
		<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
			<h2 class="text-lg font-medium">Checklist Reunderwriting</h2>
		</div>
	</div>

	<div>
		<div class="mb-3.5 border-b pb-2">
			<p class="font-medium">Seleksi Resiko Ulang (Re-Underwriting)</p>
		</div>
		<div class="space-y-2">
			<Label>
				<Checkbox /> Tertanggung Utama {$query.data?.nama_tertanggung.tertanggung_utama ? `(${$query.data?.nama_tertanggung.tertanggung_utama})` : ''}
			</Label>
			<Label>
				<Checkbox /> Tertanggung Tambahan 1
				{$query.data?.nama_tertanggung.tertanggung_tambahan_1 ? `(${$query.data?.nama_tertanggung.tertanggung_tambahan_1})` : ''}
			</Label>
		</div>
	</div>

	<div>
		<div class="mb-3.5 border-b pb-2">
			<p class="font-medium">Kelengkapan dokumen yang dibutuhkan</p>
		</div>
		<div class="grid grid-cols-2 space-y-2">
			<Label>
				<Checkbox /> Laporan Pemeriksaan Kesehatan
			</Label>
			<Label>
				<Checkbox /> Hasil Laboratorium terbaru
			</Label>
			<Label>
				<Checkbox /> Kuisioner
			</Label>
			<Label>
				<Checkbox /> Lainnya
			</Label>
		</div>
	</div>

	<div class="space-y-3.5">
		<div class="space-y-2">
			<Label for="keterangan">Keterangan pengajuan seleksi resiko ulang</Label>
			<Textarea id="keterangan" />
		</div>
		<div class="space-y-2">
			<Label for="tgl-formulir">Tanggal Formulir</Label>
			<Input id="tgl-formulir" />
		</div>
		<div class="grid grid-cols-2 gap-3.5">
			<div class="space-y-2">
				<Label for="ditandatangani">Ditandatangani Di</Label>
				<Select.Root type="single">
					<Select.Trigger id="ditandatangani" class="w-full">Select</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nama-agent">Nama CS/BC/Agent</Label>
				<Input id="nama-agent" />
			</div>
			<div class="space-y-2">
				<Label for="tanda-tangan-pp">Tanda Tangan Pemegang Polis</Label>
				<RadioGroup.Root id="tanda-tangan-pp" value="">
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="tanda-tangan-pp-ya" id="tanda-tangan-pp-ya" />
						<Label for="tanda-tangan-pp-ya">Ya</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="tanda-tangan-pp-tidak" id="tanda-tangan-pp-tidak" />
						<Label for="tanda-tangan-pp-tidak">Tidak</Label>
					</div>
				</RadioGroup.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanda-tangan-agent">Tandatangan CS / BC / Agent</Label>
				<RadioGroup.Root id="tanda-tangan-agent" value="">
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="tanda-tangan-agent-ya" id="tanda-tangan-agent-ya" />
						<Label for="tanda-tangan-agent-ya">Ya</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="tanda-tangan-agent-tidak" id="tanda-tangan-agent-tidak" />
						<Label for="tanda-tangan-agent-tidak">Tidak</Label>
					</div>
				</RadioGroup.Root>
			</div>
		</div>
		<div class="space-y-2">
			<Label for="dc-notes">DC Notes</Label>
			<Textarea id="dc-notes" />
		</div>
	</div>
</section>
