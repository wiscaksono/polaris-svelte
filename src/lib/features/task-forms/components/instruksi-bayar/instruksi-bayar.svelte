<script module lang="ts">
	let iframeElement: HTMLIFrameElement;

	export function captureInstruksiBayar(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (!iframeElement?.contentWindow) return reject('Iframe content window is not available.');

			iframeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

			const handleMessage = (event: MessageEvent) => {
				if (event.origin !== PUBLIC_BASE_PANDORA_WEB_URL) return;

				if (event.data?.type === 'CAPTURE_RESULT' && event.data.imageData) {
					window.removeEventListener('message', handleMessage);
					resolve(event.data.imageData);
				}
			};

			window.addEventListener('message', handleMessage);

			iframeElement.contentWindow.postMessage({ type: 'REQUEST_CAPTURE' }, PUBLIC_BASE_PANDORA_WEB_URL);

			setTimeout(() => {
				window.removeEventListener('message', handleMessage);
				reject('Capture request timed out.');
			}, 5000); // 5 detik timeout
		});
	}
</script>

<script lang="ts">
	import { PUBLIC_BASE_PANDORA_WEB_URL } from '$env/static/public';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const url = `${PUBLIC_BASE_PANDORA_WEB_URL}/payment-request/detail/${taskFormParams.no_trx}`;
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Instruksi Bayar" />
	<InfoGroup.Content hiddenUntilFound={false} class="bg-background" wrapperClassName="p-0">
		<iframe id="instruksi-bayar" bind:this={iframeElement} title="Instruksi Bayar" src={url} class="h-[70dvh] w-full"></iframe>
	</InfoGroup.Content>
</InfoGroup.Root>
