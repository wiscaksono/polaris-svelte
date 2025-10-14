import { queryOptions } from "@tanstack/svelte-query";

export const documentTransactionQueries = {
  get: () => {
    return queryOptions({
      queryKey: ['document-transaction'],
      queryFn: async () => {
        const { data } = await import("./data.json");
        return data;
      }
    });
  }
};
