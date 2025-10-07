import { api, mutationOptions } from "$lib/utils"

import { IS_DEV } from "$lib/utils";

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
  }
}
