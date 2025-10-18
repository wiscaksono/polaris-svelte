import { api, mutationOptions } from "$lib/utils";

export const returnToUserQueries = {
  returnToUser: ({ docId, trxMajor, regSpaj, lusId }: { docId: number; trxMajor: string; regSpaj: string; lusId: number }) => {
    return mutationOptions({
      mutationFn: async () => {
        const { message } = await api.post('/polaris/api-business-polaris/major/alteration/backToUser', { docId, trxMajor, regSpaj, lusId })
        return message
      }
    });
  }
}
