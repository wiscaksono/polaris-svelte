<script lang="ts">
	import { getTaskFormContext } from '../context.svelte';

	import DataPolis from '../components/data-polis';
	import TransaksiSwitching from '../components/transaksi-switching';
	import TransaksiRedirection from '../components/transaksi-redirection';
	import TransaksiFinancial from '../components/transaksi-financial';
	import TujuanPembayaran from '../components/tujuan-pembayaran';
	import PengkinianData from '../components/pengkinian-data';
	import AlasanTransaksi from '../components/alasan-transaksi';
	import TanggalFormulir from '../components/tanggal-formulir';
	import TandaTangan from '../components/tanda-tangan';
	import DCNotes from '../components/dc-notes';

	import type { TransactionType } from '$lib/utils';

	const { taskFormParams } = getTaskFormContext();

	const SHOW_TUJUAN_PEMBAYARAN: TransactionType[] = ['Withdrawal', 'Surrender Link', 'Cancel Free Look Link', 'Maturity Link', 'Auto Maturity Link'];
</script>

<div class="space-y-2">
	<DataPolis />
	{#if !taskFormParams.case_trx.includes('Trad') && !taskFormParams.case_trx.includes('Switching') && !taskFormParams.case_trx.includes('Redirection')}
		<!-- The rest goes here -->
		<TransaksiFinancial />
	{:else if taskFormParams.case_trx === 'Switching'}
		<TransaksiSwitching />
	{:else if taskFormParams.case_trx === 'Redirection'}
		<TransaksiRedirection />
	{:else if taskFormParams.case_trx === 'Switching and Redirection'}
		<TransaksiSwitching />
		<TransaksiRedirection />
	{/if}

	{#if SHOW_TUJUAN_PEMBAYARAN.includes(taskFormParams.case_trx)}
		<TujuanPembayaran />
	{/if}

	{#if taskFormParams.case_trx !== 'Top Up UL'}
		<PengkinianData />
	{/if}
	<AlasanTransaksi />
	<TanggalFormulir />
	<TandaTangan />
	<DCNotes />
</div>
