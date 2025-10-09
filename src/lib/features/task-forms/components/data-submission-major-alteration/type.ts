export interface DataSubmissionRes {
  tertanggung_utama?: string
  tertanggung_tambahan_1?: string
  tertanggung_tambahan_2?: string
  tertanggung_tambahan_3?: string
  tertanggung_tambahan_4?: string
  dokumen_kesehatan?: string
  dokumen_laboratorium?: string
  dokumen_kuesioner?: string
  dokumen_lainnya?: string
  keterangan?: string
  tanggal_formulir?: string
  ttd_pemegang_polis?: string
  ttd_cs_bc_agent?: string
  nama_cs_bc_agent?: string
  ttd_tempat?: string
  dc_notes?: string
  nama_tertanggung: {
    tertanggung_utama: string
    tertanggung_tambahan_1?: string
    tertanggung_tambahan_2?: string
    tertanggung_tambahan_3?: string
    tertanggung_tambahan_4?: string
  }
}



