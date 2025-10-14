import { api } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';

import type { ApproverRes } from './type';

export const approverQueries = {
	get: ({ trxMajor, idDoc }: { trxMajor: string; idDoc: string | number }) => {
		return queryOptions({
			queryKey: ['approver', trxMajor, idDoc],
			queryFn: async () => {
				const { data } = await api.get<ApproverRes>(`/polaris/api-business-polaris/major/alteration/viewApprover?trx_major=${trxMajor}&id_doc=${idDoc}`);
				return data.list_approver;
			}
		});
	}
};
