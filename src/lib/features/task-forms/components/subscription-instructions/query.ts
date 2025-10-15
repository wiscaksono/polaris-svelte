import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";
import type { SubscriptionInstructionsRes } from "./type";

export const subscriptionInstructionsQueries = {
  get: ({ noTrx }: { noTrx: string }) => {
    return queryOptions({
      queryKey: ['subscription-instructions'],
      queryFn: async () => {
        const { data } = await api.get<SubscriptionInstructionsRes>(`/polaris/api-financial-polaris/v2/financial/subscriptions/switching?trxFinancial=${noTrx}`);
        return data;
      }
    })
  }
};
