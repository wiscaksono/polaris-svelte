import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

import { taskFormRightTabs, taskForms } from '$lib/features/task-forms';
import { approvalQueries } from '$lib/features/approval/queries';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, params }) => {
  const { queryClient } = await parent();
  const { ApprovalRs: [taskFormParams] } = await queryClient.fetchQuery(approvalQueries.detailList({ caseId: params.caseID }));

  const currentTaskForm = taskForms[taskFormParams.case_trx];
  const currentTaskFormRightTabs = taskFormRightTabs[taskFormParams.case_trx];
  const currentTaskFormTab = currentTaskForm.find(({ slug }) => slug === 'worksheet');

  if (!currentTaskFormTab) throw redirect(303, resolve('/(protected)/approval/detail'));

  return { taskFormParams, currentTaskFormTab, currentTaskForm, currentTaskFormRightTabs };
};

