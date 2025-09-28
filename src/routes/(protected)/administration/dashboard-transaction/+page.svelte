<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Dashboard Transaction</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium">Dashboard Transaction</h1>
	<Input />
</section>

<section>
	<Card.Root class="flex flex-col rounded-none border-0 bg-transparent shadow-none">
		<Card.Header>
			<Card.Title>Overview</Card.Title>
			<Card.Description>A summary of the dashboard transaction</Card.Description>
		</Card.Header>
		<Card.Content class="grid grid-cols-4 divide-x">
			<div>Total Transactions</div>
			<div>Avg. Processing Time</div>
			<div>Issues Detected</div>
			<div>Most Common Type</div>
		</Card.Content>
	</Card.Root>
</section>
