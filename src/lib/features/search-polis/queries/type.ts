import type { TransactionType } from "$lib/utils/type"

export type SearchPolisListRes = Array<{
  id: number
  reg_spaj: string
  nopol: string
  case_id: number
  nama_user: string
  no_trx: string
  no_tmp: string
  id_doc_tmp: string
  from_app: string
  nama_prod: string
  case_trx: TransactionType
  kind: string
  create_at: string
  status_trx: string
  repricing: 'Yes' | 'No'
}>

