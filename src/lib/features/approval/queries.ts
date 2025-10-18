import { queryOptions } from "@tanstack/svelte-query";

import { api } from "$lib/utils";

import type { PolisListRes } from "$lib/utils";
import type { WorkbasketReq } from "../workbasket/queries/types";

const cleanProps = (props: WorkbasketReq) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== ''));

export const approvalQueries = {
  detailList: (props: WorkbasketReq) => {
    return queryOptions({
      queryKey: ["approval-detail", "list"],
      queryFn: async () => {
        const { data } = await api.post<PolisListRes<'ApprovalRs'>>("/polaris/api-business-polaris/major/workbasket/approval", {
          pageSize: props.pageSize ?? 10,
          pageNumber: props.pageNumber ?? 1,
          ...cleanProps(props)
        })
        return data
      }
    })
  }
};
