import { queryOptions } from '@tanstack/svelte-query';

import { api } from '$lib/utils';

export const addressQueries = {
  listCountry: () => {
    return queryOptions({
      queryKey: ['address', 'list-country'],
      queryFn: async () => {
        const { data } = await api.get<{ list_negara: Array<{ id: number; label: string }> }>('/polaris/api-business-polaris/major/entry/list-negara');
        return data.list_negara;
      }
    });
  },
  // Provinsi
  listProvince: (countryId?: number | null) => {
    return queryOptions({
      queryKey: ['address', 'list-province', countryId],
      queryFn: async () => {
        const { data } = await api.get<{ list_provinsi: Array<{ id: number; label: string }> }>(`/polaris/api-business-polaris/major/entry/list-provinsi/${countryId}`);
        return data.list_provinsi;
      },
      enabled: !!countryId
    });
  },
  // Kota / Kabupaten
  listCity: (provinceId?: number | null) => {
    return queryOptions({
      queryKey: ['address', 'list-city', provinceId],
      queryFn: async () => {
        const { data } = await api.get<{ list_kota_kabupaten: Array<{ id: number; label: string }> }>(`/polaris/api-business-polaris/major/entry/list-kota-kabupaten/${provinceId}`);
        return data.list_kota_kabupaten;
      },
      enabled: !!provinceId
    });
  },
  // Kecamatan
  listDistrict: (cityId?: number | null) => {
    return queryOptions({
      queryKey: ['address', 'list-district', cityId],
      queryFn: async () => {
        const { data } = await api.get<{ list_kecamatan: Array<{ id: number; label: string }> }>(`/polaris/api-business-polaris/major/entry/list-kecamatan/${cityId}`);
        return data.list_kecamatan;
      },
      enabled: !!cityId
    });
  },
  // Kelurahan
  listSubDistrict: (districtId?: number | null) => {
    return queryOptions({
      queryKey: ['address', 'list-sub-district', districtId],
      queryFn: async () => {
        const { data } = await api.get<{ list_kelurahan: Array<{ id: number; label: string }> }>(`/polaris/api-business-polaris/major/entry/list-kelurahan/${districtId}`);
        return data.list_kelurahan;
      },
      enabled: !!districtId
    });
  }
};

