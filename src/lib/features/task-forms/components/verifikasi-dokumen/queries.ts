import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import { PUBLIC_BASE_POLARIS_API_URL } from '$env/static/public';

import type { VerifikasiDokumenListDocument, VerifikasiDokumenListDocumentTypes } from './type';

export const verifikasiDokumenQueries = {
	listDocument: ({ noTrx, regSpaj }: { noTrx: string; regSpaj: string }) => {
		return queryOptions({
			queryKey: ['verifikasi-dokumen', 'list-document', noTrx, regSpaj],
			queryFn: async () => {
				const { data } = await api.post<VerifikasiDokumenListDocument>('/polaris/api-document-polaris/v1/main/list', {
					noTrx,
					regSpaj,
					type: 'VERIFICATION'
				});
				return data;
			}
		});
	},
	listDocumentTypes: () => {
		return queryOptions({
			queryKey: ['verifikasi-dokumen', 'list-document-types'],
			queryFn: async () => {
				const { data } = await api.get<VerifikasiDokumenListDocumentTypes>('/polaris/api-document-polaris/v1/main/list/types?flag=MAJOR');
				return data;
			}
		});
	},
	viewDocument: (id: string) => {
		return queryOptions({
			queryKey: ['verifikasi-dokumen', 'view', id],
			queryFn: async () => {
				const response = await fetch(`${PUBLIC_BASE_POLARIS_API_URL}/polaris/api-document-polaris/v1/main/view`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						flagType: 2, // Not sure what tf this is
						id
					})
				});

				const blob = await response.blob();
				const contentType = response.headers.get('content-type');

				return { blob, contentType };
			},
			staleTime: Infinity,
			gcTime: 1000 * 60 * 60 // Keep in cache for 1 hour
		});
	},
	uploadDocument: () => {
		return mutationOptions({
			mutationFn: async ({
				file,
				regSpaj,
				noTrx,
				idTrx,
				idJn,
				flag,
				purpose = 'STORAGE'
			}: {
				file: File;
				regSpaj: string;
				noTrx: string;
				idTrx: string;
				idJn: string;
				flag: string;
				purpose?: string;
			}) => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('regSpaj', regSpaj);
				formData.append('noTrx', noTrx);
				formData.append('idTrx', idTrx);
				formData.append('idJn', idJn);
				formData.append('flag', flag);
				formData.append('purpose', purpose);

				await api.post(`/polaris/api-document-polaris/v1/main/upload`, formData);
			}
		});
	},
	deleteDocument: () => {
		return mutationOptions({
			mutationFn: async ({ flag, regSpaj, noTrx, idDoc }: { flag: string | number; regSpaj: string; noTrx: string; idDoc: string }) => {
				await api.delete(`/polaris/api-document-polaris/v1/main/delete?flag=${flag}`, {
					regSpaj,
					noTrx,
					idDoc: [idDoc]
				});
			}
		});
	}
};
