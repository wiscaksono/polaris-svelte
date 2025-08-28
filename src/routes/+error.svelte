<script>
	import { page } from '$app/state';
</script>

<div class="error-container">
	{#if page.status === 404}
		<h1>404</h1>
		<p>Page not found</p>
	{:else if page.status === 500}
		<h1>500</h1>
		<p>Internal server error</p>
	{/if}
</div>
