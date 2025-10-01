<script lang="ts">
	// import DataDiri from './data-diri';

	import { useDataPPdanTU } from '../context.svelte';

	const data = useDataPPdanTU();
</script>

{JSON.stringify(data)}
