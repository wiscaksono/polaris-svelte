import { api } from '$lib/api';

import type { PolisListRes } from '$lib/type';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const pageSize = url.searchParams.get('pageSize')
		? parseInt(url.searchParams.get('pageSize') as string)
		: 10;

	const pageNumber = url.searchParams.get('pageNumber')
		? parseInt(url.searchParams.get('pageNumber') as string)
		: 1;

	const { data } = await api.post<PolisListRes<'newSubmission'>>(
		'/polaris/api-business-polaris/major/workbasket/filterSubmission',
		{
			pageSize,
			pageNumber
		}
	);

	return data;
};
