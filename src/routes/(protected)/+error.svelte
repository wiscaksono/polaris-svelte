<script>
	import { Clipboard, Check } from '@lucide/svelte';
	import { page } from '$app/state';

	let isCopied = $state(false);

	function handleCopy() {
		if (!page.error?.errorId) return;

		navigator.clipboard.writeText(page.error?.errorId);

		isCopied = true;

		setTimeout(() => {
			isCopied = false;
		}, 1000);
	}
</script>

<div class="grid size-full place-items-center">
	<div class="w-full max-w-lg space-y-6 text-center">
		<div class="space-y-3">
			<h1 class="text-3xl font-bold">{page.status}</h1>
			<p class="text-zinc-600">
				{page.error?.message}
			</p>
		</div>
		<div class="space-y-2">
			<p class="text-sm font-medium text-zinc-600">Reference code:</p>
			<div class="relative rounded-lg bg-zinc-100 p-3">
				<code class="font-mono text-sm">{page.error?.errorId}</code>
				<button class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full text-zinc-400">
					{#if isCopied}
						<Check class="size-5 text-green-500" />
					{:else}
						<Clipboard
							class="size-5 text-zinc-400 hover:text-zinc-600"
							size={16}
							onclick={handleCopy}
						/>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>
