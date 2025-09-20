<script lang="ts">
	let { text, term }: { text: string | number; term: string } = $props();

	/**
	 * Escapes special characters in a string for use in a regular expression.
	 * @param str The string to escape.
	 * @returns The escaped string.
	 */
	const escapeRegExp = (str: string) => {
		// $& means the whole matched string
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	// Derived state in Svelte 5 is similar to useMemo in React.
	// These values will automatically recompute when their dependencies (text, term) change.

	const stringText = $derived(String(text));
	const safeTerm = $derived(escapeRegExp(term));

	const parts = $derived.by(() => {
		// If there's no term to search for, return the original text as a single part.
		if (!safeTerm) return [stringText];

		// Create a case-insensitive and global regular expression with a capturing group.
		const regex = new RegExp(`(${safeTerm})`, 'gi');

		// Split the text by the regex. The capturing group ensures that the
		// matched term is included in the resulting array.
		// e.g., "Hello World".split(/(o)/) -> ["Hell", "o", " W", "o", "rld"]
		return stringText.split(regex);
	});
</script>

{#each parts as part, i (i)}
	{#if i % 2 === 1 && safeTerm}
		<span class="bg-yellow-200 text-foreground dark:bg-yellow-800">{part}</span>
	{:else}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html part.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
	{/if}
{/each}
