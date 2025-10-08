import { api } from "$lib/utils";
import type { AlertAnotherTrxRes } from "./type";

export const alertAnotherTrxQueries = {
  get: ({ idDoc, regSpaj }: { idDoc: number, regSpaj: string }) => {
    return {
      queryKey: ['alert-another-trx', idDoc, regSpaj],
      queryFn: async () => {
        const { data } = await api.post<AlertAnotherTrxRes>('/polaris/core/financial/cekGantunganTrx', { idDoc, regSpaj })
        return data.listGantunganTrx;
      }
    };
  }
};
