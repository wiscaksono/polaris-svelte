import { queryOptions } from "@tanstack/svelte-query"

import { api, mutationOptions } from "$lib/utils"
import type * as Type from "./type";

export const furtherRequirementFinancialQueries = {
  get: ({ regSpaj, noTrx }: { regSpaj: string; noTrx: string }) => {
    return queryOptions({
      queryKey: ['further-requirement-financial'],
      queryFn: async () => {
        const { data } = await api.get<Type.FurtherRequirementFinancialRes>(
          `/polaris/api-document-polaris/financial/v1/further/list?regSpaj=${regSpaj}&noTrx=${noTrx}`
        )
        return data
      }
    })
  },
  delete: () => {
    return mutationOptions({
      mutationFn: async ({ regSpaj, noTrx, lssaId, subId, detId }: { regSpaj: string; noTrx: string; lssaId: string; subId: string; detId: string }) => {
        const searchParams = new URLSearchParams()
        searchParams.append('regSpaj', regSpaj)
        searchParams.append('noTrx', noTrx)
        searchParams.append('lssaId', lssaId)
        searchParams.append('subId', subId)
        searchParams.append('detId', detId)

        await api.delete(`/polaris/api-document-polaris/financial/v1/further/delete?${searchParams.toString()}`)
      }
    })
  },
  deleteOrUpdate: () => {
    return mutationOptions({
      mutationFn: async (payload: Type.FurtherRequirementFinancialUpdateOrDeleteReq) => {
        await api.post('/polaris/api-document-polaris/financial/v1/further/add', payload)
      }
    })
  },
  listMenuFurther: () => {
    return queryOptions({
      queryKey: ['further-requirements-financial', 'list-menu-further'],
      queryFn: async () => {
        const { data } = await api.get<Type.FurtherRequirementFinancialMenuListRes>('/polaris/api-document-polaris/financial/v1/further/list/45');
        return data;
      }
    });
  },
  listSubMenuFurther: (subId: number | string) => {
    return queryOptions({
      queryKey: ['further-requirement', 'list-sub-menu-further', subId],
      queryFn: async () => {
        const { data } = await api.get<Type.FurtherRequirementFinancialSubMenuListRes>(`/polaris/api-document-polaris/financial/v1/further/list/45/${subId}`);
        return data;
      }
    });
  }
}
