<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import DetailItem from '../../detail-item.svelte';
	import Heading from '$lib/components/heading.svelte';
	import { dataPolisClientRolesQueries } from '$lib/features/data-polis/queries';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPPdanTU(regSpaj)));
	const data = $derived($query.data?.pemegangPolis.alamatPenagihan);
	const isLoading = $derived($query.isLoading);
</script>

<div class="space-y-5">
	<section id="alamat-penagihan" aria-labelledby="alamat-penagihan-heading" class="scroll-m-2">
		<Heading title="Alamat Penagihan" description="Please provide accurate billing address details. These will be used for policy correspondence." />
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				<DetailItem label="Region" value={data?.region} {isLoading} />
				<DetailItem label="Contact Person" value={data?.contact} {isLoading} />
				<DetailItem label="Negara" value={data?.negara} {isLoading} />
				<DetailItem label="Wilayah" value={data?.wilayah} {isLoading} />
				<DetailItem label="Kota" value={data?.kota} {isLoading} />
				<DetailItem label="Kode Pos" value={data?.areaCode1} {isLoading} />
				<DetailItem label="Alamat" value={data?.address} {isLoading} />
			</div>
			<div class="divide-y">
				<DetailItem label="Telepon 1" value={data?.phone1} {isLoading} />
				<DetailItem label="Telepon 2" value={data?.phone2} {isLoading} />
				<DetailItem label="Telepon 3" value={data?.phone3} {isLoading} />
				<DetailItem label="No. Fax 1" value={data?.areaCodeFax1} {isLoading} />
				<DetailItem label="No. Fax 2" value={data?.areaCodeFax2} {isLoading} />
				<DetailItem label="Email" value={data?.email} {isLoading} />
				<DetailItem label="No. HP 1" value={data?.noHp} {isLoading} />
				<DetailItem label="No. HP 2" value={data?.noHp2} {isLoading} />
			</div>
		</div>
	</section>
</div>
