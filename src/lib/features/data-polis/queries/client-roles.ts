import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type * as Type from './type';

export const dataPolisClientRolesQueries = {
  dataPPdanTU: (regSpaj: string) => {
    return queryOptions({
      queryKey: ['data-polis', 'data-pp-tu', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPolisClientRolesDataPPdanTURes>(`/polaris/api-summary-polaris/summary/client-roles?regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  dataPertanggungan: (regSpaj: string) => {
    return queryOptions({
      queryKey: ['data-polis', 'data-pertanggungan', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPolisPertanggunganRes>(`/polaris/api-summary-polaris/summary/data-pertanggungan?regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  dataPembayaranPremi: (regSpaj: string) => {
    return queryOptions({
      queryKey: ['data-polis', 'data-pembayaran-premi', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPolisPembayaranPremiRes>(`/polaris/api-summary-polaris/summary/data-pembayar-premi?regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
};
