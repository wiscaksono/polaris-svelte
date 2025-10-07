import { queryOptions } from "@tanstack/svelte-query";

import { api, mutationOptions } from "$lib/utils";
import type { UnderwrittingNoteRes } from "./type";

export const underwrittingNoteQueries = {
  get: ({ trxMajor, idDoc }: { trxMajor: string; idDoc: string | number }) => {
    return queryOptions({
      queryKey: ['underwritting-note', trxMajor, idDoc],
      queryFn: async () => {
        const { data } = await api.get<UnderwrittingNoteRes>(`/polaris/api-business-polaris/major/alteration/getWorksheet?trx_major=${trxMajor}&id_doc=${idDoc}`);
        return data.list_worksheet
      }
    });
  },
  update: () => {
    return mutationOptions({
      mutationFn: async (payload: UnderwrittingNoteRes['list_worksheet']) => {
        await api.post(`/polaris/api-business-polaris/major/alteration/insertWorksheet`, payload)
      }
    })
  }
};
