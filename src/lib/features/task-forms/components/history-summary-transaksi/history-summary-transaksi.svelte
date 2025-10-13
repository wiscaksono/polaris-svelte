<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { formatCurrency } from '$lib/utils';
	import { historySummaryTransaksiQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => historySummaryTransaksiQueries.get({ regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="History Summary Transaksi" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="Jumlah Switching (dalam ultah polis)" value={query.data?.jumlahSwitching} isLoading={query.isLoading} />
			<DetailItem label="Jumlah Withdrawal" value={query.data?.jumlahWithdrawal} isLoading={query.isLoading} />
			<DetailItem label="Total Pembayaran Premi" value={formatCurrency(query.data?.totalPremiBayar ?? 0, 'IDR', 'id-ID')} isLoading={query.isLoading} />
			<DetailItem label="Total Potongan Bulanan" value={query.data?.totalPotongan} isLoading={query.isLoading} />
			<DetailItem label="Total Withdraw" value={query.data?.totalWithdraw} isLoading={query.isLoading} />
			<DetailItem label="Total Realokasi" value={query.data?.totalRealokasi} isLoading={query.isLoading} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
