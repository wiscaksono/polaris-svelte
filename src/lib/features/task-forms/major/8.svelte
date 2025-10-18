<script lang="ts">
	import jsPDF from 'jspdf';
	import { snapdom } from '@zumer/snapdom';
	import { FileText, LoaderCircle } from '@lucide/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import TabTwo from './2.svelte';
	import TabThree from './3.svelte';
	import TabFour from './4.svelte';
	import TabFive from './5.svelte';
	import TabSix from './6.svelte';
	import TabNine from './9.svelte';

	import Approver from '../components/approver';
	import ApproverNotes from '../components/approver-notes';
	import HistoryApproval from '../components/history-approval';
	import UnderwrittingNote from '../components/underwritting-note';
	import DecisionFinalMajorAlteration from '../components/decision-final-major-alteration';

	import Button from '$lib/components/ui/button/button.svelte';
	import ReturnToUser from '../components/actions/return-to-user';
	import ApprovalApprove from '../components/actions/approval-approve';

	import { getTaskFormContext } from '../context.svelte';
	import { taskFormQueries } from '../queries';

	let element: HTMLElement;

	const { taskFormParams, meta } = getTaskFormContext();

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
		},
		onSuccess: async (blob) => await uploaDocumentMutation.mutateAsync(blob)
	}));
</script>

<div class="space-y-2">
	{#if taskFormParams.kind === 'Approval'}
		<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
			<ReturnToUser />
			<ApprovalApprove {generatePDFMutation} />
		</div>
	{/if}
	{#if meta.isActionAllowed}
		<div class="flex items-center justify-end gap-2 overflow-x-auto border-b pb-2">
			<Button onclick={() => generatePDFMutation.mutate()} class="!pl-2" disabled={generatePDFMutation.isPending}>
				{#if generatePDFMutation.isPending}
					<LoaderCircle class="animate-spin" />
				{:else}
					<FileText />
				{/if}
				Generate PDF
			</Button>
		</div>
	{/if}
	<div class="space-y-2" bind:this={element}>
		<TabTwo />
		<TabThree />
		<TabFour />
		<TabFive />
		<TabSix />
		<TabNine />
		<UnderwrittingNote />
		<DecisionFinalMajorAlteration />
		<Approver />
		<HistoryApproval />
		<ApproverNotes />
	</div>
</div>
