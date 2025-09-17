<script lang="ts">
	let { children, data } = $props();

	const { previousHref, nextHref } = $derived.by(() => {
		const currentTabIndex = data.currentTaskForm.findIndex(({ slug }) => slug === data.currentTaskFormTab?.slug);

		const previousSlug = data.currentTaskForm[currentTabIndex - 1]?.slug;
		const nextSlug = data.currentTaskForm[currentTabIndex + 1]?.slug;

		return {
			previousHref: previousSlug ? `/workbasket/new-submission/${data.policyDetail.case_id}/${previousSlug}` : '',
			nextHref: nextSlug ? `/workbasket/new-submission/${data.policyDetail.case_id}/${nextSlug}` : ''
		};
	});
</script>

<header class="flex justify-between border-b py-2">
	<p>{data.policyDetail.case_trx}</p>
	<div class="flex gap-x-2">
		<a href={previousHref} aria-disabled={!previousHref} class:disabled={!previousHref}>Previous</a>
		<a href={nextHref} aria-disabled={!nextHref} class:disabled={!nextHref}>Next</a>
	</div>
</header>

<ul class="flex gap-2 overflow-x-auto border-b py-2">
	{#each data.currentTaskForm as { title, slug } (title)}
		<a class="text-sm font-semibold whitespace-nowrap" href={`/workbasket/new-submission/${data.policyDetail.case_id}/${slug}`}>{title}</a>
	{/each}
</ul>

<div class="py-2">
	{@render children()}
</div>

<div class="border-t py-2">Workflow History</div>
