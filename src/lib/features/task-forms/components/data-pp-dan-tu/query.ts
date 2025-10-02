import { api, mutationOptions } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';

import type { DataPPdanTURes } from './type';

interface UpdatePayload {
	caseId: number;
	regSpaj: string;
	trxMajor: string;
	dataDiri?: DataPPdanTURes['pemegangPolis']['dataDiri']['after'];
	infoPekerjaan?: DataPPdanTURes['pemegangPolis']['infoPekerjaan']['after'];
	alamat?: {
		rumah?: DataPPdanTURes['pemegangPolis']['alamat']['after']['rumah'];
		pekerjaan?: DataPPdanTURes['pemegangPolis']['alamat']['after']['pekerjaan'];
		domisili?: DataPPdanTURes['pemegangPolis']['alamat']['after']['domisili'];
	};
	financial?: DataPPdanTURes['pemegangPolis']['financial']['after'];
	wajibPajakNegaraAsing?: DataPPdanTURes['pemegangPolis']['wajibPajakNegaraAsing']['after'];
}

export const dataPPdanTUQueries = {
	get: ({ caseId, regSpaj }: { caseId: number; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['data-pp-dan-tu', caseId, regSpaj],
			queryFn: async () => {
				const { data } = await api.get<DataPPdanTURes>(`/polaris/api-business-polaris/major/alteration/data-pp-dan-tu?caseId=${caseId}&regSpaj=${regSpaj}`);
				return data;
			}
		});
	},
	update: () => {
		return mutationOptions({
			mutationFn: async ({ caseId, regSpaj, trxMajor, dataDiri, alamat, financial, infoPekerjaan, wajibPajakNegaraAsing }: UpdatePayload, context) => {
				const previousQueryKey = dataPPdanTUQueries.get({ caseId, regSpaj }).queryKey;
				const previousData = context.client.getQueryData(previousQueryKey);
				if (!previousData) return;

				await api.post('/polaris/api-business-polaris/major/new-sub/data-pp-dan-tu', {
					trxMajor,
					regSpaj,
					caseId,
					dataDiri: dataDiri ?? previousData.pemegangPolis.dataDiri.after,
					infoPekerjaan: infoPekerjaan ?? previousData.pemegangPolis.infoPekerjaan.after,
					alamat: {
						rumah: alamat?.rumah ?? previousData.pemegangPolis.alamat.after.rumah,
						pekerjaan: alamat?.pekerjaan ?? previousData.pemegangPolis.alamat.after.pekerjaan,
						domisili: alamat?.domisili ?? previousData.pemegangPolis.alamat.after.domisili
					},
					financial: financial ?? previousData.pemegangPolis.financial.after,
					wajibPajakNegaraAsing: wajibPajakNegaraAsing ?? previousData.pemegangPolis.wajibPajakNegaraAsing.after
				});

				return previousQueryKey;
			}
		});
	}
};
