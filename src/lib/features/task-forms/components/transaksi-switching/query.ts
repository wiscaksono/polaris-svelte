import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";
import type { TransaksiSwitchingFundSourcesRes, TransaksiSwitchingFundDestinationRes } from "./type";

export const transaksiSwitchingQuery = {
  existingFundSources: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ['transaksi-switching', 'exsiting-funds', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<TransaksiSwitchingFundSourcesRes>(`/polaris/api-data-entry-polaris/v1/financial/getExistingFundSources?regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  destinationFundSources: ({ lsbsId, lsdbsNumber, currencyCode, regSpaj }: { lsbsId: number, lsdbsNumber: number, currencyCode: string, regSpaj: string }) => {
    return queryOptions({
      queryKey: ['transaksi-switching', 'destination-funds', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<TransaksiSwitchingFundDestinationRes>(`/polaris/api-data-entry-polaris/v1/financial/getAvailableDestinationFunds?lsbsId=${lsbsId}&lsdbsNumber=${lsdbsNumber}&currencyCode=${currencyCode}`);
        return data;
      }
    });
  }
};
