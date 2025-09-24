import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

import type { DataPolisClientRolesDataPPdanTURes, DataPolisPertanggunganRes } from './type';

export const dataPolisClientRolesQueries = {
  dataPPdanTU: (regSpaj: string) => {
    return queryOptions({
      queryKey: ['data-polis', 'data-pp-tu', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<DataPolisClientRolesDataPPdanTURes>(`/polaris/api-summary-polaris/summary/client-roles?regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  dataPertanggungan: (regSpaj: string) => {
    return queryOptions({
      queryKey: ['data-polis', 'data-pertanggungan', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<DataPolisPertanggunganRes>(`/polaris/api-summary-polaris/summary/data-pertanggungan?regSpaj=${regSpaj}`);
        return data;
      }
    });
  }
};
