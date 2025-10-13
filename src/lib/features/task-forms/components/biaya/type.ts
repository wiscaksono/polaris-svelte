export type BiayaRes = Array<{
  amount: number,
  id: number
  jenis_biaya: string
  jenis_biaya_id: number
  persen: number
}>

export type BiayaListJenisTransaksiRes = Array<{
  ljb_id: number
  jenis_biaya: string
}>

export type BiayaCrudReq = Array<{
  amount: number
  id: number
  ljbId: number
  noTransaksi: string
  persen: number
}>
