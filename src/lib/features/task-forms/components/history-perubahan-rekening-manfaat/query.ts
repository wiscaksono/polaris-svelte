import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";
import type { HistoryPerubahanRekeningManfaatRes } from "./type";

export const historyPerubahanRekeningManfaatQueries = {
  get: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ["history-perubahan-rekening-manfaat", regSpaj],
      queryFn: async () => {
        const { data } = await api.get<HistoryPerubahanRekeningManfaatRes>(`/polaris/api-financial-polaris/v1/financial/worksheet/getHistoryRekeningManfaat?regSpaj=${regSpaj}`);
        return data;
      }
    });
  }
};    
