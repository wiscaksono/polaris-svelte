<script lang="ts">
	import jsPDF from 'jspdf';
	import { snapdom } from '@zumer/snapdom';
	import { FileText, LoaderCircle } from '@lucide/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import DataPolis from '../components/data-polis';
	import AhliWaris from '../components/ahli-waris';
	import TransaksiFinancial from '../components/transaksi-financial';
	import TransaksiSwitching from '../components/transaksi-switching';
	import TransaksiRedirection from '../components/transaksi-redirection/transaksi-redirection.svelte';
	import SuspendedPremium from '../components/suspended-premium';
	import HistorySummaryTransaksi from '../components/history-summary-transaksi';
	import DataInvestasi from '../components/data-investasi-polis';
	import VerifikasiDokumen from '../components/verifikasi-dokumen';
	import FurtherRequirementsFinancial from '../components/further-requirements-financial';
	import RedemptionInstruction from '../components/redemption-instruction';
	import FaktorPenambah from '../components/faktor-penambah';
	import JumlahYangDibayarkan from '../components/jumlah-yang-dibayarkan';
	import SubscriptionInstructions from '../components/subscription-instructions';
	import Biaya from '../components/biaya';
	import PengkinianData from '../components/pengkinian-data';
	import HistoryPerubahanRekeningManfaat from '../components/history-perubahan-rekening-manfaat';
	import InstruksiBayar from '../components/instruksi-bayar';
	import AnalystNotes from '../components/analyst-notes';
	import Approver from '../components/approver';
	import HistoryApproval from '../components/history-approval';
	import ApproverNotes from '../components/approver-notes';
	import Button from '$lib/components/ui/button/button.svelte';

	import Approve from '../components/actions/approve';
	import CancelTicket from '../components/actions/cancel-ticket-financial';
	import Decline from '../components/actions/decline';
	import ReturnToUser from '../components/actions/return-to-user';
	import ApprovalApprove from '../components/actions/approval-approve';

	import { captureInstruksiBayar } from '../components/instruksi-bayar/instruksi-bayar.svelte';

	import { getTaskFormContext } from '../context.svelte';
	import { taskFormQueries } from '../queries';

	import type { TransactionType } from '$lib/utils';

	let element: HTMLElement;

	const { taskFormParams } = getTaskFormContext();

	const SHOW_INSTRUKSI_BAYAR: TransactionType[] = ['Withdrawal', 'Surrender Link', 'Cancel Free Look Link', 'Maturity Link', 'Auto Maturity Link'];
	const SHOW_JUMLAH_DIBAYARKAN: TransactionType[] = [
		'Withdrawal',
		'Surrender Link',
		'Cancel Free Look Link',
		'Maturity Link',
		'Auto Maturity Link',
		'Top Up UL'
	];

	const uploaDocumentMutation = createMutation(() =>
		taskFormQueries.uploadWorksheetPDF({
			transaction: taskFormParams.case_trx,
			nopol: taskFormParams.nopol,
			caseId: String(taskFormParams.case_id),
			regSpaj: taskFormParams.reg_spaj,
			noTrx: taskFormParams.no_trx
		})
	);

	const generatePDFMutation = createMutation(() => ({
		mutationFn: async () => {
			const paddingMm = 5;
			const iframe = element.querySelector('#instruksi-bayar') as HTMLIFrameElement;
			let imgReplacement: HTMLImageElement | null = null;

			try {
				if (iframe) {
					const iframeImageBase64 = await captureInstruksiBayar();
					imgReplacement = document.createElement('img');
					imgReplacement.src = iframeImageBase64;
					imgReplacement.style.height = iframe.clientHeight + 'px';
					imgReplacement.style.width = iframe.clientWidth + 'px';
					imgReplacement.style.display = 'block';

					iframe.parentNode?.replaceChild(imgReplacement, iframe);
				}

				const canvas = await snapdom.toCanvas(element);

				const imgWidthPx = canvas.width;
				const imgHeightPx = canvas.height;
				const pxToMm = (px: number) => (px * 25.4) / 96;
				const imgWidthMm = pxToMm(imgWidthPx);
				const imgHeightMm = pxToMm(imgHeightPx);

				const pdfWidth = imgWidthMm + paddingMm * 2;
				const pdfHeight = imgHeightMm + paddingMm * 2;
				const dataUrl = canvas.toDataURL('image/png');
				const pdf = new jsPDF({
					orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
					unit: 'mm',
					format: [pdfWidth, pdfHeight]
				});

				pdf.addImage(dataUrl, 'PNG', paddingMm, paddingMm, imgWidthMm, imgHeightMm, '', 'MEDIUM');
				pdf.save(`Worksheet - ${taskFormParams.nopol} - ${taskFormParams.case_id}.pdf`);

				return pdf.output('blob');
			} finally {
				if (iframe && imgReplacement && imgReplacement.parentNode) {
					imgReplacement.parentNode.replaceChild(iframe, imgReplacement);
				}
			}
		},
		onSuccess: async (blob) => {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			await uploaDocumentMutation.mutateAsync(blob);
		}
	}));
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
		{#if taskFormParams.kind === 'Approval'}
			<ReturnToUser />
			<ApprovalApprove {generatePDFMutation} />
		{:else}
			<CancelTicket />
			<Decline />
			<Approve />
			<Button onclick={() => generatePDFMutation.mutate()} class="!pl-2" disabled={generatePDFMutation.isPending}>
				{#if generatePDFMutation.isPending}
					<LoaderCircle class="animate-spin" />
				{:else}
					<FileText />
				{/if}
				Generate PDF
			</Button>
		{/if}
	</div>
	<div class="space-y-2" bind:this={element}>
		<DataPolis />
		<AhliWaris />
		{#if !taskFormParams.case_trx.includes('Trad') && !taskFormParams.case_trx.includes('Switching') && !taskFormParams.case_trx.includes('Redirection') && !taskFormParams.case_trx.includes('Cancel')}
			<TransaksiFinancial />
		{:else if taskFormParams.case_trx === 'Switching'}
			<TransaksiSwitching />
		{:else if taskFormParams.case_trx === 'Redirection'}
			<TransaksiRedirection />
		{:else if taskFormParams.case_trx === 'Switching and Redirection'}
			<TransaksiSwitching />
			<TransaksiRedirection />
		{/if}
		<SuspendedPremium />
		<HistorySummaryTransaksi />
		<DataInvestasi />
		<VerifikasiDokumen />
		<FurtherRequirementsFinancial />
		{#if taskFormParams.case_trx === 'Top Up UL'}
			<SubscriptionInstructions />
		{:else}
			<RedemptionInstruction />
		{/if}
		{#if taskFormParams.case_trx === 'Cancel Free Look Link'}
			<FaktorPenambah />
		{/if}
		<Biaya />
		{#if SHOW_JUMLAH_DIBAYARKAN.includes(taskFormParams.case_trx)}
			<JumlahYangDibayarkan />
		{/if}
		<PengkinianData />
		<HistoryPerubahanRekeningManfaat />
		{#if SHOW_INSTRUKSI_BAYAR.includes(taskFormParams.case_trx)}
			<InstruksiBayar />
		{/if}
		<AnalystNotes />
		<Approver />
		<HistoryApproval />
		<ApproverNotes />
	</div>
</div>
