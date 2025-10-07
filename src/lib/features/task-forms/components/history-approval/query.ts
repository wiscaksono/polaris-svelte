import { api } from "$lib/utils";
import { queryOptions } from "@tanstack/svelte-query";
import type { HistoryApprovalRes } from "./type";

export const historyApprovalQueries = {
  get: ({ trxMajor, idDoc }: { trxMajor: string; idDoc: string | number }) => {
    return queryOptions({
      queryKey: ['history-approval', trxMajor, idDoc],
      queryFn: async () => {
        const data = await api.get(`/polaris/api-business-polaris/major/alteration/history-approval?trxId=${trxMajor}&docId=${idDoc}`);
        return data as unknown as HistoryApprovalRes;
      }
    });
  }
};
