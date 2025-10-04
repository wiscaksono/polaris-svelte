export type VerifikasiDokumenListDocument = Array<{
  ID: string
  ID_DOC: string
  FLAG_TYPE: string
  FLAG_DOC: string
  JENIS_DOC: string
  FILENAME: string
  NO_TRX: string
  REG_SPAJ: string
  CREATED_DATE: string
}>

export type VerifikasiDokumenListDocumentTypes = Array<{
  flag: string
  fileName: string
  idJnDoc: number
  desc: string
}>
