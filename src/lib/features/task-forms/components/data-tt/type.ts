import type { IDLabel } from "$lib/utils"

export interface DataTTRes {
  no_trx: string
  reg_spaj: string
  tertanggung_tambahan: Array<{
    before: {
      data_diri: DataTTRes['tertanggung_tambahan'][0]['after']['data_diri'] | null
      informasi_pekerjaan: DataTTRes['tertanggung_tambahan'][0]['after']['informasi_pekerjaan'] | null
      alamat_domisili: DataTTRes['tertanggung_tambahan'][0]['after']['alamat_domisili'] | null
      sar: DataTTRes['tertanggung_tambahan'][0]['after']['sar']
    }
    after: {
      data_diri: {
        nama_lengkap: string
        jenis_kelamin: IDLabel<number>
        tempat_lahir: string | null
        tanggal_lahir: string
        usia: number
        nama_gadis_ibu_kandung: string | null
        status_pernikahan: IDLabel<number>
        kewarganegaraan: IDLabel<number>
        hobi_beresiko_tinggi: IDLabel<number>
        hubungan_terhadap_tertanggung_utama: IDLabel<number>
        no_hp: string | null
        kode_telepon: string | null
        no_telepon: string | null
      }
      informasi_pekerjaan: {
        nama_perusahaan_lembaga: string | null
        jenis_usaha: IDLabel<string>
        jabatan: IDLabel<string>
        uraian_pekerjaan: string | null
      }
      alamat_domisili: {
        alamat_tempat_tinggal: string | null
        negara: IDLabel<number>
        provinsi: IDLabel<number>
        kota_kabupaten: IDLabel<number>
        kecamatan: IDLabel<number>
        kelurahan: IDLabel<number>
        kode_pos: string | null
      }
      sar: {
        totalSarLife: number | null
        totalSarCI: number | null
        totalSarPA: number | null
        totalSarTPD: number | null
        medicalSARLife: number | null
        medicalSARCI: number | null
        medicalSARTPD: number | null
        medicalSARPA: number | null
        medicalSARPANew: number | null
        medicalRequirement: string | null
      }
    }
    nama_tertanggung: string
    mcl_id: string | null
    mcl_id_new: string | null
    no_urut: string
    action: string
    set_old_customer: boolean
    lsbsId: number | null
    lsdbsNumber: number | null
  }>
}
