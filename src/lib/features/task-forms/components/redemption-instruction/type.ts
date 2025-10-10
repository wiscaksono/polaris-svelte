export type RedemptionInstructionRes = Array<{
  jenis: string
  jenisInvestasi: string
  tanggalTransaksi: string | null
  tanggalNAV: string | null
  amount: number | null
  unit: number | null
  hargaUnit: number | null
  tanggalUpdate: string | null
  tanggalInstruction: string
  kurs: string
}>
