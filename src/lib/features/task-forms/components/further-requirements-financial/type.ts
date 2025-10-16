export type FurtherRequirementFinancialRes = Array<{
  tglInsert: string
  subId: number
  detId: number
  kategori: string
  remarks: string | null
  updateDate: string | null
  statusFurther: string
  tglDecision: string | null
}>

export interface FurtherRequirementFinancialUpdateOrDeleteReq {
  data: Array<{
    regSpaj: string
    trxFin: string
    lusId: number
    lssaId: number
    subId: number
    detId: number
    remarks: string
    completed: string
  }>
}

export type FurtherRequirementFinancialMenuListRes = Array<{
  lssa_id: number
  sub_id: number
  sub_desc: string
}>


export type FurtherRequirementFinancialSubMenuListRes = Array<{
  det_id: number
  lsad_desc: string
  lssa_id: number
  sub_id: number
}>
