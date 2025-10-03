import type { DataTTRes } from "../type";
import type { DeepKeys, NonNullableProps } from "$lib/utils";

export const initialValues: NonNullableProps<Omit<DataTTRes['tertanggung_tambahan'][number]['after'], 'sar'>> = {
  data_diri: {
    nama_lengkap: '',
    jenis_kelamin: { id: null, label: '' },
    tempat_lahir: '',
    tanggal_lahir: '',
    usia: 0,
    nama_gadis_ibu_kandung: null,
    status_pernikahan: { id: null, label: '' },
    kewarganegaraan: { id: null, label: '' },
    hobi_beresiko_tinggi: { id: null, label: '' },
    hubungan_terhadap_tertanggung_utama: { id: null, label: '' },
    no_hp: null,
    kode_telepon: null,
    no_telepon: null
  },
  informasi_pekerjaan: { nama_perusahaan_lembaga: null, jenis_usaha: { id: null, label: '' }, jabatan: { id: null, label: '' }, uraian_pekerjaan: null },
  alamat_domisili: {
    alamat_tempat_tinggal: null,
    negara: { id: null, label: '' },
    provinsi: { id: null, label: '' },
    kota_kabupaten: { id: null, label: '' },
    kecamatan: { id: null, label: '' },
    kelurahan: { id: null, label: '' },
    kode_pos: null
  }
};

export const requiredFields: DeepKeys<NonNullableProps<typeof initialValues>>[] = [
  'data_diri.nama_lengkap',
  'data_diri.tempat_lahir',
  'data_diri.tanggal_lahir',
  'data_diri.jenis_kelamin.id',
  'data_diri.jenis_kelamin.label',
  'data_diri.status_pernikahan.id',
  'data_diri.status_pernikahan.label',
  'data_diri.kewarganegaraan.id',
  'data_diri.kewarganegaraan.label',
  'data_diri.hobi_beresiko_tinggi.id',
  'data_diri.hobi_beresiko_tinggi.label',
  'data_diri.hubungan_terhadap_tertanggung_utama.id',
  'data_diri.hubungan_terhadap_tertanggung_utama.label',
  'informasi_pekerjaan.nama_perusahaan_lembaga',
  'informasi_pekerjaan.jabatan.id',
  'informasi_pekerjaan.jabatan.label',
  'alamat_domisili.alamat_tempat_tinggal',
  'alamat_domisili.negara.id',
  'alamat_domisili.negara.label'
];
