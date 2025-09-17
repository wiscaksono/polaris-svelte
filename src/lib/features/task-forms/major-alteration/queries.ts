import { api } from "$lib/utils";
import { queryOptions } from "@tanstack/svelte-query";

import * as Types from "./type";

export const majorAlterationQueries = {
  tab1: ({ noTrx, regSpaj }: { noTrx: string | number; regSpaj: string | number }) => {
    return queryOptions({
      queryKey: ['major-alteration', 'tab-1', noTrx, regSpaj],
      queryFn: async () => {
        const { data } = await api.get(`/polaris/api-business-polaris/major/alteration/getDataReunderwriting?noTrx=${noTrx}&regSpaj=${regSpaj}`);
        return data;
      }
    });
  },
  tab2: ({ caseId, regSpaj }: { caseId: string | number; regSpaj: string | number }) => {
    return queryOptions({
      queryKey: ['major-alteration', 'tab-2', caseId, regSpaj],
      queryFn: async () => {
        const { data } = await api.get<Types.MajorAlterationTab2Res>(`/polaris/api-business-polaris/major/alteration/data-pp-dan-tu?caseId=${caseId}&regSpaj=${regSpaj}`)
        return data;
      }
    })
  }
};
