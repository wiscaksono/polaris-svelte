import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';
import type * as Type from './type';

export const dataPertanggunganQueries = {
  get: ({ caseId, regSpaj, noTmp }: { caseId: number; regSpaj: string, noTmp: string }) => {
    return queryOptions({
      queryKey: ['data-pertanggungan', caseId, regSpaj, noTmp],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPertanggunganRes>(`/polaris/api-business-polaris/major/alteration/data-pertanggungan?noTmp=${noTmp}&caseId=${caseId}&regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  update: () => {
    return mutationOptions({
      mutationFn: async (payload: Type.DataPertanggunganRes) => {
        await api.post('/polaris/api-business-polaris/major/alteration/data-pertanggungan-save', payload)
      }
    })
  },
  listProduct: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ['data-pertanggungan', 'list-product', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPertanggunganListProductRes>(`/polaris/api-business-polaris/major/entry/list-product-asuransi-dasar/${regSpaj}`)
        return data.list_product_manfaat_basic
      }
    })
  },
  listSubProduct: ({ regSpaj, riderId, repricing }: { regSpaj: string, riderId: number, repricing: number }) => {
    return queryOptions({
      queryKey: ['data-pertanggungan', 'list-sub-product', regSpaj, riderId, repricing],
      queryFn: async () => {
        const { data } = await api.get<Type.DataPertanggunganListSubProductRes>(`/polaris/api-business-polaris/major/entry/list-subproduct-mad/${regSpaj}/${riderId}/${repricing}`)
        return data.list_subproduct_manfaat_basic
      }
    })
  },
};

