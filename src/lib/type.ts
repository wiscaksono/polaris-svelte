export interface Polis {
	reg_spaj: string;
	nopol: string;
	flag_vip: string;
	polis_type: string;
	status_polis: string;
	attention_list: string;
	premium_holiday: string | null;
	kategory: string;
	substandard: string | null;
	waiver: string;
	loan: string;
	banker_clause: string | null;
	case_trx: string;
	nama_user: string;
	status_trx: string;
	case_id: number;
	ticket_overdue: number | null;
	create_at: string;
	from_app: 'POLARIS' | 'ORION';
	nama_prod: string;
	no_temp: string;
	trx_major: string;
	id_doc_temp: string;
	no_draft?: string;
	no_trx?: string;
	flagged: boolean;
}

export type PolisListRes<T extends string> = {
	totalPage: number;
	totalRecord: number;
} & {
	[key in T]: Polis[];
};

export interface ListMenu {
	id: number;
	name: string;
	count: number | null;
	sub: SubMenu[];
}

export interface SubMenu {
	id: number;
	name: string;
	count: number | null;
}
