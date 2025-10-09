import { queryOptions } from "@tanstack/svelte-query"

import { api } from "$lib/utils"
import type { TujuanPembayaranRes } from "./type"

export const tujuanPembayaranQueries = {
  get: ({ noTrx }: { noTrx: string }) => {
    return queryOptions({
      queryKey: ['tujuan-pembayaran', noTrx],
      queryFn: async () => {
        const { data } = await api.get<TujuanPembayaranRes>(`/polaris/api-financial-polaris/v1/financial/getTransferAndFunding?noTrx=${noTrx}`)
        return data
      }
    })
  }
}
