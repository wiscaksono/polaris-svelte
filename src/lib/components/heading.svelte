<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<div class="relative">
	<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
		<h2 class="text-xl font-medium text-primary">{title}</h2>
		{#if description}
			<p class="text-muted-foreground">{description}</p>
		{/if}
	</div>
</div>
