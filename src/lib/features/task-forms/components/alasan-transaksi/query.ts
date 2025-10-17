import { queryOptions } from '@tanstack/svelte-query';

import { api, type TransactionType, TRANSACTION_IDS } from '$lib/utils';
import type { AlasanTransaksiListReasonRes } from './type';

export const alasanTransaksiQueries = {
	listReason: ({ transaction }: { transaction: TransactionType }) => {
		return queryOptions({
			queryKey: ['alasan-transaksi', 'list-reason'],
			queryFn: async () => {
				let transactionID = null

				switch (transaction) {
					case 'Maturity Link':
					case 'Maturity Trad':
					case 'Auto Maturity Link':
					case 'Auto Maturity Trad':
						transactionID = TRANSACTION_IDS['Maturity Trad']
						break;
					case 'Cancel Free Look Link':
						transactionID = TRANSACTION_IDS['Cancel Free Look Link']
						break;
					case 'Cancel Free Look Trad':
						transactionID = TRANSACTION_IDS['Cancel Free Look Trad']
						break;
					case 'Switching':
					case 'Redirection':
						transactionID = TRANSACTION_IDS['Switching and Redirection']
						break;
					case 'Surrender Trad':
						transactionID = TRANSACTION_IDS['Surrender Trad']
						break;
					case 'Surrender Link':
						transactionID = TRANSACTION_IDS['Surrender Link']
						break;
					case 'Top Up UL':
						transactionID = TRANSACTION_IDS['Top Up UL']
						break;
					default:
						transactionID = TRANSACTION_IDS[transaction]
						break;
				}

				const { data } = await api.get<AlasanTransaksiListReasonRes>(`/polaris/api-data-entry-polaris/v1/financial/reasons?transaction=${transactionID}`);
				return data;
			}
		});
	}
};
