import type { IDLabel } from '$lib/utils/type';

export interface ListAllSelectRes {
	list_all: {
		agama: IDLabel<number>[];
		alamat_korespondensi: IDLabel<number>[];
		billing_frequency: IDLabel<number>[];
		bukti_identitas: IDLabel<number>[];
		hobi_beresiko_tinggi: IDLabel<number>[];
		hubungan_pemegang_polis_dengan_tertanggung: IDLabel<number>[];
		hubungan_terhadap_tertanggung_utama: IDLabel<number>[];
		jabatan: IDLabel<string>[];
		jenis_kelamin: IDLabel<number>[];
		jenis_usaha: IDLabel<string>[];
		kewarganegaraan: IDLabel<number>[];
		mata_uang_rekening: IDLabel<string>[];
		nama_bank: IDLabel<number>[];
		perkiraan_penghasilan_kotor_per_tahun: IDLabel<string>[];
		status_pernikahan: IDLabel<number>[];
		sumber_dana: IDLabel<number>[];
		tujuan_membeli_asuransi: IDLabel<number>[];
	};
}

export interface ListJenisTRXRes {
	jenis_transaksi: {
		TRX_ID: number
		DESCRIPTION: string
	}[]
}

export interface ListUserRes {
	user_assign: {
		LUS_ID: number
		LUS_FULL_NAME: string
	}[]
}
