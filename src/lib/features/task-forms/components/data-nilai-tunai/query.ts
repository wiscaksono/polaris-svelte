import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";
import type { DataNilaiTunaiRes } from "./type";

export const dataNilaiTunaiQueries = {
  get: ({ regSpaj }: { regSpaj: string }) => {
    return queryOptions({
      queryKey: ['data-nilai-tunai', regSpaj],
      queryFn: async () => {
        const { data } = await api.get<DataNilaiTunaiRes>(`/polaris/api-financial-polaris/v1/financial/getDataTunaiTrad?regSpaj=${regSpaj}`);
        return data;
      }
    });
  }
};
