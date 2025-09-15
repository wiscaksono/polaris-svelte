export interface DataPolisListRes {
	totalPage: number;
	'Data Polis': {
		idreg: string;
		nopol: string;
		no_spaj: string;
		status: string;
		nama_product: string;
		kurs: string;
		premi: string;
		nama_pp: string;
		nama_tt: string;
		tgl_lahir_pp: string;
		tgl_lahir_tt: string;
		no_identitas?: string;
	}[];
}
