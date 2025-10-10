import { api } from "$lib/utils"
import type { TransaksiWithdrawalListfundRes } from "./type"

export const transaksiWithdrawalQueries = {
  listFund: ({ regSpaj }: { regSpaj: string }) => {
    return {
      queryKey: ['transaksi-withdrawal', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<TransaksiWithdrawalListfundRes>(`/polaris/api-data-entry-polaris/v1/financial/getExistingFundSources?regSpaj=${regSpaj}`)
        return data
      }
    }
  }
}
