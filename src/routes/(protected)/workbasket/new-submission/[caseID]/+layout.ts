import { searchPolisQueries } from "$lib/features/search-polis/queries";
import { taskForms } from "$lib/features/task-forms";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, params }) => {
  const { queryClient } = await parent();
  const [policyDetail] = await queryClient.fetchQuery(searchPolisQueries.list(params.caseID));
  const currentTaskForm = taskForms[policyDetail.case_trx];
  return { policyDetail, currentTaskForm }
};


