import type { TrackedData } from '$lib/utils';

export interface DataPertanggunganRes {
	draft_major: string;
	reg_spaj: string;
	data_pertanggungan: {
		manfaat_asuransi_dasar: {
			flagAction: 'NEW' | 'EDITED' | 'DELETED' | '-';
		} & TrackedData<{
			nama_produk: { riderId: number; product: string };
			nama_sub_produk: { id: number; label: string; ldp_plan: number | null; flag_prometh: number };
			uang_pertanggungan: number;
			masa_pertanggungan: number;
			tanggal_mulai_pertanggungan: string;
			tanggal_akhir_pertanggungan: string;
			basic_premium: number;
			topup_premium: number;
			billing_frequency: { id: number; label: string };
			cuti_premi_ke: number;
			masa_bayar: number;
			kurs: { id: string; label: string };
			flagJenisPeserta: number | null;
			mspr_urut: number | null;
			flag_deduct: number;
			em: number | null;
			amount_extra: number | null;
			msprFlagJenis: number;
			diagnosis: string | null;
			mcl_id: string | null;
			lsre_id: number | null;
			mspr_discount: number | null;
			ins_period: number;
			ins_param: unknown | null;
			waive_period: number | null;
		}>;
		manfaat_asuransi_tambahan: Array<
			{
				action: string;
				flagAction: string;
				flag_peserta: number;
				flag_prometh: number;
				id: number;
				nama_rider: string;
				no_urut: number;
			} & TrackedData<{
				jenis_tertanggung: { id: number; label: string };
				nama_tertanggung: string;
				mcl_id: number | null;
				nama_produk: { product: string; riderId: number };
				nama_sub_produk: { flag_new: null | string; id: number; label: string; ldp_plan: number };
				premi: number;
				mpp: number;
				unit: { id: number; label: string };
				clas: { id: number; label: string };
				persentase_pertanggungan: number;
				uang_pertanggungan: number;
				masa_pertanggungan: number;
				tanggal_mulai_pertanggungan: string;
				tanggal_akhir_pertanggungan: string;
				msprUrut: number;
				flagJenisPeserta: number | null;
				flagPrometh: number | null;
				flag_deduct: number;
				waiver_duration: string | null;
				em: number;
				amount_extra: number | null;
				msprFlagJenis: number;
				diagnosis: string | null;
				lsre: number | null;
				mspr_discount: number | null;
				ins_period: number;
				ins_param: unknown | null;
				waive_period: number | null;
			}>
		>;
		tanggal_efektif: TrackedData<{ tanggal_efektif_premi: string; tanggal_efektif_pertanggungan: string }>;
		total_premi: TrackedData<{ total_premi: number }>;
	};
}

export interface DataPertanggunganListProductRes {
	list_product_manfaat_basic: Array<{ riderId: number; repricing: number; product: string }>;
}

export interface DataPertanggunganListProductNewRes {
	list_product: Array<{ riderId: number; repricing: number | null; product: string }>;
}

export interface DataPertanggunganListSubProductMADRes {
	list_subproduct_manfaat_basic: Array<{
		lsbs_id: number;
		id: number;
		label: string;
		ldp_plan: number | null;
		flag_prometh: number;
		flag_deduct: number;
	}>;
}

export interface DataPertanggunganListSubProductMATRes {
	list_subproduct: Array<{
		rider_id: number;
		rider_number: number;
		lsdbs_name: string;
		flag_pp: number;
		flag_tu: number;
		flag_tt: number;
		ldp_plan: number | null;
		flag_prometh: number;
		flag_deduct: number;
	}>;
}

export interface DataPertanggunganListTertanggungRes {
	list_tertanggung: Array<{
		mcl_id: string;
		flag_peserta: number;
		noUrut: number;
		jenis_tertanggung: string;
		nama_tertanggung: string;
	}>;
}

export interface DataPertanggunganListWaiverDurationRes {
	list_waiver: Array<{
		lsbs_id: number;
		lsdbs_number: number;
		ldp_plan: number;
		ldp_name: string;
	}>;
}

export interface DataPertanggunganListUnitRes {
	list_unit: Array<{
		id: number;
		label: string;
	}>;
}

export interface DataPertanggunganListClassRes {
	list_class: Array<{
		id: number;
		label: string;
	}>;
}
