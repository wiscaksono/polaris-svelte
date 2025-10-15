<script lang="ts">
	import { getTaskFormContext } from '../context.svelte';

	import DataPolis from '../components/data-polis';
	import TransaksiFinancial from '../components/transaksi-financial';
	import TujuanPembayaran from '../components/tujuan-pembayaran';
	import PengkinianData from '../components/pengkinian-data';
	import AlasanTransaksi from '../components/alasan-transaksi';
	import TanggalFormulir from '../components/tanggal-formulir';
	import TandaTangan from '../components/tanda-tangan';
	import DCNotes from '../components/dc-notes';

	const { taskFormParams } = getTaskFormContext();
</script>

<div class="space-y-2">
	<DataPolis />
	{#if !taskFormParams.case_trx.includes('Trad')}
		<TransaksiFinancial />
	{/if}
	<TujuanPembayaran />
	<PengkinianData />
	<AlasanTransaksi />
	<TanggalFormulir />
	<TandaTangan />
	<DCNotes />
</div>
