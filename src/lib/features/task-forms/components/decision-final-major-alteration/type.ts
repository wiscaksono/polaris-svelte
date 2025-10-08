export interface DecisionFinalMajorAlterationRes {
  decision: [{
    value: number
    label: string
    generateSPB: boolean
  }] | []
  effectiveDatePertanggungan: string | null
  effectiveDate: string | null
}

export type DecisionFinalMajorAlterationListDecisionRes = Array<{
  value: number
  label: string
  generateSPB: boolean | null
}>

export interface DecisionFinalMajorAlterationUpdateReq {
  trxMajor: string
  flagInsert: 1
  regSpaj: string
  decId: number
  flagMajor: 1
  idDoc: number
  generateSPB: boolean
  effectiveDate: string
  effectiveDatePertanggungan: string
}
