import { queryOptions } from "@tanstack/svelte-query";

import { api, mutationOptions, IS_DEV } from "$lib/utils"
import * as Type from "./type"

export const actionQueries = {
  cancelTicket: ({ lusId, noTrx, regSpaj, docId, nopol }: { lusId: number; noTrx: string, regSpaj: string, docId: number, nopol: string }) => {
    return mutationOptions({
      mutationFn: async ({ remarks, reason, file }: { remarks: string; reason: string, file: FileList | undefined }) => {
        const promises: Promise<unknown>[] = []

        promises.push(api.post('/polaris/api-business-polaris/major/alteration/cancelFurther', {
          docId,
          remarks,
          regSpaj,
          reason,
          lusId,
          trxMajor: noTrx
        }))

        if (file) {
          const formData = new FormData()
          formData.append('file', file[0], file[0].name)
          formData.append('regSpaj', regSpaj)
          formData.append('noTrx', noTrx)
          formData.append('idTrx', '1')
          formData.append('idJn', '303')
          formData.append('flag', '2')
          formData.append('purpose', 'STORAGE')

          promises.push(api.post('/polaris/api-document-polaris/v1/main/upload', formData))
        }

        if (IS_DEV) {
          promises.push(api.post(`/polaris/api-simultansar-polaris/major/payloadUrsa`, {
            trxMajor: noTrx,
            regSpaj,
            noPolis: nopol
          }))
        }

        await Promise.all(promises)
      }
    })
  },
  getApproveButtonState: ({ docId, regSpaj, trxMajor, lusId }: { docId: number, regSpaj: string, trxMajor: string, lusId: number }) => {
    return queryOptions({
      queryKey: ['action-approve', 'get-button-state', docId, regSpaj, trxMajor, lusId],
      queryFn: async () => {
        const { data } = await api.post<Type.ApproveButtonStateRes>('/polaris/api-business-polaris/major/alteration/buttonApproval', {
          regSpaj,
          docId,
          trxMajor,
          lusId
        })

        return data
      }
    })
  },
  getApproveButtonOldProduct: ({ trxMajor, regSpaj }: { trxMajor: string, regSpaj: string }) => {
    return queryOptions({
      queryKey: ['action-approve', 'validate-button-state', trxMajor, regSpaj],
      queryFn: async () => {
        const { message } = await api.get<boolean>(`/polaris/api-business-polaris/major/general/validateProductAndBilling/?noTrx=${trxMajor}&regSpaj=${regSpaj}`)
        return message
      }
    })
  },
  getApprovalButtonLimitValidation: ({ docId, regSpaj, trxMajor, lusId }: { docId: number, regSpaj: string, trxMajor: string, lusId: number }) => {
    return queryOptions({
      queryKey: ['action-approve', 'todo', docId, regSpaj, trxMajor, lusId],
      queryFn: async () => {
        const { data } = await api.post<Type.ApproveButtonLimitValidationRes>('/polaris/api-business-polaris/major/alteration/validasiApproval', {
          regSpaj,
          docId,
          trxMajor,
          lusId
        })
        return data
      }
    })
  }
}
