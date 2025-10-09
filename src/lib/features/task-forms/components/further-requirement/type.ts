export interface FurtherRequirementRes {
  listFurtherTrx: Array<{
    tglInsert: string
    kategori: string
    remarks: string
    urlDoc: string | null
    tglUpdateBerkas: string | null
    statusFurther: 'ACCEPT' | 'PENDING' | 'COMPLETED'
    tglDecision: string | null
    noFurther: string
    subId: number
    detId: number
    flagAction: number | null
    idDoc: number
    regSpaj: string
    lusId: number
    tglUpload: string | null
    filename: string | null
    tglInsertEntry: string | null
  }>
}

export interface FurtherRequirementMenuListRes {
  listFurther: Array<{
    lssa_id: number
    sub_id: number
    sub_desc: string
  }>
}

export interface FurtherRequirementSubMenuListRes {
  detailFurtherList: Array<{
    lssa_id: number
    sub_id: number
    det_id: number
    lsad_desc: string
  }>
}

export interface FormSPMRes {
  trxSpm: Array<{
    regSpaj: string
    ltmId: number | null
    lusId: number | null
    flagAction: number | null
    noTrx: number
    tglInsert: string
    medisUntuk: string
    nama_pp: string
    usia: number
    jenis_kelamin: string
    biaya_tanggung: string
    ket_medis: string | null
    tgl_update: string | null
    status: string
    tgl_completed: string | null
    tipe_medis: string | null
    detailMedis: string[]
    smc_id: string
    mcl_id: string
    detailTambahan: Array<{
      ldmId: number
      namaMedis: string
      flag: boolean
    }>
    approval_date: string | null
  }>
}

export interface FormSPMDetailTipeMedisRes {
  detail_medis: string[]
}

export interface FormSPMListMedisUntukRes {
  datalist_spm: Array<{
    reg_spaj: string
    nama_pp: string
    usia: number
    jenis: string
    jenis_kelamin: string
    mcl_id: string
  }>
}

export interface FormSPMListMedisRes {
  data: Array<{
    ltmId: number
    tipeMedis: string
  }>
}

export interface FormSPMListMedisAdditionalRes {
  detail_tambahan: Array<{
    ldm_id: number
    nama_medis: string
  }>
}
