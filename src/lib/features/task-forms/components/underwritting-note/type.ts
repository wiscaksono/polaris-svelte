export interface UnderwrittingNoteRes {
  list_worksheet: {
    no_worksheet: string | null
    reg_spaj: string | null
    id_doc: number
    ket_fin_pp: string | null
    ket_med_pp: string | null
    ket_fin_tu: string | null
    ket_med_tu: string | null
    uw_spesific: string
    uw_general: string
    suspicious: string | null
    ab_find_pp: string | null
    ab_find_tu: string | null
    analyst_sar_pp: string | null
    analyst_sar_tu: string | null
    trx_major: string | null
  }
}
