import { queryOptions, type CreateMutationResult } from "@tanstack/svelte-query";

import { api, mutationOptions } from "$lib/utils";

export const approvalApproveQueries = {
  approve: ({ docId, trxMajor, regSpaj, lusId, approverNotes, generatePDFMutation }: { docId: number; trxMajor: string; regSpaj: string; lusId: number, approverNotes: string, generatePDFMutation: CreateMutationResult<Blob, Error, void, unknown> }) => {
    return mutationOptions({
      mutationFn: async () => {
        await Promise.all([
          api.post('/polaris/api-business-polaris/major/alteration/approvalApprove', {
            docId,
            trxMajor,
            regSpaj,
            lusId,
            approverNotes
          }),
          generatePDFMutation.mutateAsync()
        ])
      }
    });
  },
  isFinalApprove: ({ caseId }: { caseId: number }) => {
    return queryOptions({
      queryKey: ['approval-is-final-approve', caseId],
      queryFn: async () => {
        const { data } = await api.get<{ isFinalApprove: boolean }>(`/polaris/api-business-polaris/approval/checkIsFinalApprove?idDoc=${caseId}`)
        return data.isFinalApprove
      }
    })
  }
}


