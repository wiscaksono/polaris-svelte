import type { TrackedData } from "$lib/utils";

export interface DecisionPerProductRes {
  editableDecision: boolean;
  listPeserta: Array<{
    namaTertanggung: string;
    lssaId: number | null;
    lssaSubId: number | null;
    notes: string | null;
    flagJenisPeserta: number | null;
    lsbsIdExtra: number | null;
    lsdbsNumberExtra: number | null;
    msprUrut: number;
    mspeInsuredNo: number | null;
  } & TrackedData<{
    kurs: string | null;
    uangPertanggungan: number | null;
    jenisAkseptasi: string | null;
    jenisExtra: Array<{ lsbs_id: number; jenis_extra: string }> | [] | null;
    subAkseptasi: Array<{ sub_id: number; desc_display: string }> | null;
    em: number | null;
    satuan: string | null;
    tambahanBiaya: number | null;
    keteranganSubstrandar: string | null;
    diagnosisDescription: Array<{ lic_id: string; diagnosis: string }> | null;
    typeStd: number | null;
    jumlah: number | null;
    keteranganExclusion: string | null;
    productName: string;
    mclId: string;
    lsbsId: number;
    lsdbsNumber: number;
  }>>;
}

export interface DecisionPerProductListJenisAkseptasiRes {
  jenisAkseptasi: Array<{
    status: string
    lssa_id: number
  }>;
}

export interface DecisionPerProductListSubAkseptasiRes {
  subAkseptasi: Array<{
    desc_display: string | 'EXTRA' | 'EXCLUSION'
    sub_id: number
  }>;
}

export interface DecisionPerProductListJenisExtraRes {
  jenisExtra: Array<{
    lsbs_id: number
    jenis_extra: string
  }>;
}

export interface DecisionPerProductListDiagnosisRes {
  diagnosisList: Array<{
    lic_id: string
    diagnosis: string
  }>;
}
