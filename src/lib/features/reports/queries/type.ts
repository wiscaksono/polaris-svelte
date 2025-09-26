export type ReportsTransactionListRes = Array<{
  trxId: number,
  ltId: number | null,
  description: string
}>

export type ReportTransactionResultRes = Array<{
  noPolicy: string
  transaction: string
  noTransaction: string
  statusTransaction: string
  submitDate: string
  lastApprovalDate: string | null
  sendAqua: string | null
  navDate: string | null
  fund: string
  amount: number
  unit: number
  hargaUnit: number
  biaya: number
  paymentInstruction: string | null
  paymentDate: string | null
  journalCreatedDate: string | null
  journalAccrual: string | null
  journalUangKeluar: string | null
  journalUangMasuk: string | null
}>
