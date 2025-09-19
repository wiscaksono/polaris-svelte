<script lang="ts">
	import { onMount } from 'svelte';

	let time = $state(new Date());

	onMount(() => {
		const interval = setInterval(() => (time = new Date()), 1000);
		return () => clearInterval(interval);
	});

	const timeFormatter = new Intl.DateTimeFormat('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

<div class="hidden flex-col items-end text-right text-sm leading-tight md:flex">
	<p class="font-medium">{timeFormatter.format(time)}</p>
	<p class="text-muted-foreground">{dateFormatter.format(time)}</p>
</div>
