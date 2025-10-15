import { api } from "$lib/utils";
import { queryOptions } from "@tanstack/svelte-query";

import type { FaktorPenambahRes } from "./type";

export const faktorPenambahanQueries = {
  get: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ['faktor-penambah', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<FaktorPenambahRes>(`/polaris/api-financial-polaris/v1/financial/additionals/cost/cancelfreelook?regSpaj=${regSpaj}`);
        return data;
      }
    })
  }
}
