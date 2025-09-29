export interface ReassignTaskListRes {
	totalPage: number;
	totalRecord: number;
	listTransaksi: Array<{
		jenis_transaksi: string;
		no_polis: string;
		reg_spaj: string;
		tanggal_submit: string;
		nama_user: string;
		case_id: number;
		lus_id: number;
		jenis_trx: number;
		no_temp: string | null;
		no_trx: string;
	}>;
}

export interface ReassignTaskUsersRes {
	'user-polaris': Array<{
		NAMA_USER: string;
		LUS_ID: number;
	}>;
}
