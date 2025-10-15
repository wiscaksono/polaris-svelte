<script lang="ts">
	import jsPDF from 'jspdf';
	import { snapdom } from '@zumer/snapdom';
	import { FileText, LoaderCircle } from '@lucide/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import DataPolis from '../components/data-polis';
	import AhliWaris from '../components/ahli-waris';
	import SuspendedPremium from '../components/suspended-premium';
	import HistorySummaryTransaksi from '../components/history-summary-transaksi';
	import DataInvestasi from '../components/data-investasi-polis';
	import VerifikasiDokumen from '../components/verifikasi-dokumen';
	import FurtherRequirement from '../components/further-requirement';
	import RedemptionInstruction from '../components/redemption-instruction';
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

	import { captureInstruksiBayar } from '../components/instruksi-bayar/instruksi-bayar.svelte';

	import { getTaskFormContext } from '../context.svelte';

	let element: HTMLElement;

	const { taskFormParams } = getTaskFormContext();

	const mutation = createMutation(() => ({
		mutationFn: async () => {
			const paddingMm = 5;
			const iframe = element.querySelector('#instruksi-bayar') as HTMLIFrameElement;

			if (!iframe) throw new Error('Instruksi Bayar iframe not found');

			const iframeImageBase64 = await captureInstruksiBayar();
			const imgReplacement = document.createElement('img');
			imgReplacement.src = iframeImageBase64;
			imgReplacement.style.height = iframe.clientHeight + 'px';
			imgReplacement.style.width = iframe.clientWidth + 'px';
			imgReplacement.style.display = 'block';

			try {
				iframe.parentNode?.replaceChild(imgReplacement, iframe);

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

				pdf.addImage(dataUrl, 'PNG', paddingMm, paddingMm, imgWidthMm, imgHeightMm);
				pdf.save(`Worksheet - ${taskFormParams.nopol} - ${taskFormParams.case_id}.pdf`);
			} finally {
				if (imgReplacement.parentNode) imgReplacement.parentNode.replaceChild(iframe, imgReplacement);
			}
		},
		onSuccess: () => element.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}));
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
		<CancelTicket />
		<Decline />
		<Approve />
		<Button onclick={() => mutation.mutate()} class="!pl-2" disabled={mutation.isPending}>
			{#if mutation.isPending}
				<LoaderCircle class="animate-spin" />
			{:else}
				<FileText />
			{/if}
			Generate PDF
		</Button>
	</div>
	<div class="space-y-2" bind:this={element}>
		<DataPolis />
		<AhliWaris />
		<SuspendedPremium />
		<HistorySummaryTransaksi />
		<DataInvestasi />
		<VerifikasiDokumen />
		<FurtherRequirement />
		<RedemptionInstruction />
		<Biaya />
		<PengkinianData />
		<HistoryPerubahanRekeningManfaat />
		<InstruksiBayar />
		<AnalystNotes />
		<Approver />
		<HistoryApproval />
		<ApproverNotes />
	</div>
</div>
