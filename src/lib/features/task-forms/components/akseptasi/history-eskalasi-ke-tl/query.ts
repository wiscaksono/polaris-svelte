import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";
import type { HistoryEskalasiKeTLRes } from "./type";

export const historyEskalasiKeTLQueries = {
  get: ({ noTrx }: { noTrx: string }) => {
    return queryOptions({
      queryKey: ["history-eskalasi-ke-tl", noTrx],
      queryFn: async () => {
        const { data } = await api.get<HistoryEskalasiKeTLRes>(`/polaris/api-business-polaris/v1/general/getEskalasi?noTrx=${noTrx}`);
        return data;
      }
    })
  }
};
