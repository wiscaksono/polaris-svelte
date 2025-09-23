<script lang="ts">
	const isProd = process.env.NODE_ENV === 'production';
</script>

{#if !isProd}
	<div class="fixed right-16 bottom-3 z-[999999999] flex h-6 w-6 items-center justify-center rounded-full bg-destructive p-3 font-mono text-[10px] text-white">
		<div class="block sm:hidden">xs</div>
		<div class="hidden sm:block md:hidden">sm</div>
		<div class="hidden md:block lg:hidden">md</div>
		<div class="hidden lg:block xl:hidden">lg</div>
		<div class="hidden xl:block 2xl:hidden">xl</div>
		<div class="hidden 2xl:block">2xl</div>
	</div>
{/if}
