import { api } from '$lib/utils';
import type { TransaksiFinancialListFundRes } from './type';

export const transaksiFinancialQueries = {
	listFund: ({ regSpaj }: { regSpaj: string }) => {
		return {
			queryKey: ['transaksi-withdrawal', regSpaj],
			queryFn: async () => {
				const { data } = await api.get<TransaksiFinancialListFundRes>(
					`/polaris/api-data-entry-polaris/v1/financial/getExistingFundSources?regSpaj=${regSpaj}`
				);
				return data;
			}
		};
	}
};
