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
