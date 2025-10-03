import { queryOptions } from '@tanstack/svelte-query';

import { api, mutationOptions } from '$lib/utils';

import type { DataTTRes } from './type';

export const dataTTQueries = {
  get: ({ caseId, regSpaj }: { caseId: number; regSpaj: string }) => {
    return queryOptions({
      queryKey: ['data-tt', caseId, regSpaj],
      queryFn: async () => {
        const { data } = await api.get<DataTTRes>(`/polaris/api-business-polaris/major/alteration/dataTertanggungTambahan?regSpaj=${regSpaj}&idDoc=${caseId}`)
        return data
      }
    })
  },
  create: () => {
    return mutationOptions({
      mutationFn: async ({ initialData, newData }: { initialData: DataTTRes, newData: Omit<DataTTRes['tertanggung_tambahan'][number]['after'], 'sar'> }) => {
        const lastNoUrut = initialData.tertanggung_tambahan.length > 0 ? parseInt(initialData.tertanggung_tambahan[initialData.tertanggung_tambahan.length - 1].no_urut) : 0;

        const { data } = await api.post('/polaris/api-business-polaris/major/workbasket/newsub-update-additional-insured', {
          ...initialData,
          tertanggung_tambahan: [
            ...initialData.tertanggung_tambahan,
            {
              mcl_id: '',
              mcl_id_new: '',
              no_urut: `${lastNoUrut + 1}`,
              nama_tertanggung: '',
              set_old_customer: false,
              action: 'new',
              before: {
                data_diri: null,
                informasi_pekerjaan: null,
                alamat_domisili: null
              },
              after: {
                data_diri: newData.data_diri,
                informasi_pekerjaan: newData.informasi_pekerjaan,
                alamat_domisili: newData.alamat_domisili
              }
            }
          ]
        })
        return data
      }
    })
  },
  update: () => {
    return mutationOptions({
      mutationFn: async ({ initialData, newData, index }: { initialData: DataTTRes, newData: Omit<DataTTRes['tertanggung_tambahan'][number]['after'], 'sar'>, index: number }) => {

        const { data } = await api.post('/polaris/api-business-polaris/major/workbasket/newsub-update-additional-insured', {
          ...initialData,
          tertanggung_tambahan: [
            ...initialData.tertanggung_tambahan,
            {
              ...initialData.tertanggung_tambahan[index],
              action: 'edit',
              after: {
                data_diri: newData.data_diri,
                informasi_pekerjaan: newData.informasi_pekerjaan,
                alamat_domisili: newData.alamat_domisili
              }
            }
          ]
        })
        return data
      }
    })
  },
  delete: () => {
    return mutationOptions({
      mutationFn: async ({ initialData, index }: { initialData: DataTTRes, index: number }) => {

        const { data } = await api.post('/polaris/api-business-polaris/major/workbasket/newsub-update-additional-insured', {
          ...initialData,
          tertanggung_tambahan: [
            ...initialData.tertanggung_tambahan,
            {
              ...initialData.tertanggung_tambahan[index],
              action: 'delete',
            }
          ]
        })
        return data
      }
    })
  }
}
