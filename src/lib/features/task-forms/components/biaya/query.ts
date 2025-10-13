import { queryOptions } from "@tanstack/svelte-query"

import { api, mutationOptions } from "$lib/utils"

import type { BiayaRes, BiayaListJenisTransaksiRes, BiayaCrudReq } from "./type"

export const biayaQueries = {
  get: ({ noTrx, regSpaj }: { noTrx: string, regSpaj: string }) => {
    return queryOptions({
      queryKey: ['biaya', noTrx, regSpaj],
      queryFn: async () => {
        const { data } = await api.get<BiayaRes>(`/polaris/api-financial-polaris/financial/getBiayaDataInvestasi?trxFinancial=${noTrx}&regSpaj=${regSpaj}`)
        return data
      }
    })
  },
  listJenisTransaksi: () => {
    return queryOptions({
      queryKey: ['biaya', 'list-biaya'],
      queryFn: async () => {
        const { data } = await api.get<BiayaListJenisTransaksiRes>('/polaris/api-financial-polaris/financial/listJenisTransaksi')
        return data
      }
    })
  },
  crud: (action: "CREATE" | "UPDATE" | "DELETE") => {
    return mutationOptions({
      mutationFn: async (data: BiayaCrudReq[number]) => {
        const url = '/polaris/api-financial-polaris/financial/listJenisTransaksiSave'
        const payload = [data]

        switch (action) {
          case 'CREATE':
            await api.post(url, { payload })
            break;
          case 'UPDATE':
            await api.put(url, { payload })
            break;
          case 'DELETE':
            await api.delete(url, { payload })
            break;
        }
      }

    })
  }
}
