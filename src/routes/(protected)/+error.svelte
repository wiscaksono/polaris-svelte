<script>
	import { page } from '$app/state';
</script>

<div class="grid size-full place-items-center">
	<div class="w-full max-w-lg space-y-6 text-center">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold">{page.status}</h1>
			<p class="text-muted-foreground">
				{page.error?.message}
				{page.error?.errorId}
			</p>
		</div>
	</div>
</div>
