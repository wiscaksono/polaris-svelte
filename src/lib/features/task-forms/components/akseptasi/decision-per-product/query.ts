import { queryOptions } from "@tanstack/svelte-query"

import { api } from "$lib/utils"
import * as Type from './type'

export const decisionPerProductQuery = {
  get: ({ regSpaj, idDoc }: { regSpaj: string | number; idDoc: string | number }) => {
    return queryOptions({
      queryKey: ['decision-per-product', regSpaj, idDoc],
      queryFn: async () => {
        const { data } = await api.get<Type.DecisionPerProductRes>(`/polaris/api-business-polaris/major/alteration/decisionForm?regSpaj=${regSpaj}&idDoc=${idDoc}`)
        return data
      }
    })
  },
  listJenisAkseptasi: () => {
    return queryOptions({
      queryKey: ['decision-per-product', 'list-jenis-akseptasi'],
      queryFn: async () => {
        const { data } = await api.get<Type.DecisionPerProductListJenisAkseptasiRes>('/polaris/api-business-polaris/major/alteration/jenisAkseptasiAfter')
        return data.jenisAkseptasi
      }
    })
  },
  listSubAkseptasi: () => {
    return queryOptions({
      queryKey: ['decision-per-product', 'list-sub-akseptasi'],
      queryFn: async () => {
        const { data } = await api.get<Type.DecisionPerProductListSubAkseptasiRes>('/polaris/api-business-polaris/major/alteration/subAkseptasiAfter')
        return data.subAkseptasi
      }
    })
  },
  listJenisExtra: () => {
    return queryOptions({
      queryKey: ['decision-per-product', 'list-jenis-extra'],
      queryFn: async () => {
        const { data } = await api.get<Type.DecisionPerProductListJenisExtraRes>('/polaris/api-business-polaris/major/alteration/jenisExtraDecisionAfter')
        return data.jenisExtra
      }
    })
  },
  listDiagnosis: () => {
    return queryOptions({
      queryKey: ['decision-per-product', 'list-diagnosis'],
      queryFn: async () => {
        const { data } = await api.get<Type.DecisionPerProductListDiagnosisRes>('/polaris/api-business-polaris/major/alteration/decisionDiagnosis')
        return data.diagnosisList
      }
    })
  }
}
