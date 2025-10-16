import { queryOptions } from '@tanstack/svelte-query';

import { api, type TransactionType, transactionIDs } from '$lib/utils';
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
						transactionID = transactionIDs['Maturity Trad']
						break;
					case 'Cancel Free Look Link':
						transactionID = transactionIDs['Cancel Free Look Link']
						break;
					case 'Cancel Free Look Trad':
						transactionID = transactionIDs['Cancel Free Look Trad']
						break;
					case 'Switching':
					case 'Redirection':
						transactionID = transactionIDs['Switching and Redirection']
						break;
					case 'Surrender Trad':
						transactionID = transactionIDs['Surrender Trad']
						break;
					case 'Surrender Link':
						transactionID = transactionIDs['Surrender Link']
						break;
					case 'Top Up UL':
						transactionID = transactionIDs['Top Up UL']
						break;
					default:
						transactionID = transactionIDs[transaction]
						break;
				}

				const { data } = await api.get<AlasanTransaksiListReasonRes>(`/polaris/api-data-entry-polaris/v1/financial/reasons?transaction=${transactionID}`);
				return data;
			}
		});
	}
};
