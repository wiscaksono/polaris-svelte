export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export interface BaseResponse<T> {
	result: string;
	error: boolean;
	message: string;
	data: T;
}

export interface TrackedData<T> {
	before: T;
	after: T;
};

export type DeepKeys<T, Prev extends string = ''> = {
	[K in keyof T & string]:
	T[K] extends object
	? `${Prev}${K}` | DeepKeys<T[K], `${Prev}${K}.`>
	: `${Prev}${K}`;
}[keyof T & string];

export type IDLabel<T extends string | number> = {
	id: T | null;
	label: string;
};

export type NonNullableProps<T> = {
	[K in keyof T]: NonNullable<T[K]>
};

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
	case_trx: TransactionType;
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

export interface User {
	role_name: string;
	lus_id: number;
	user_login_name: string;
	user_full_name: string;
	pathfile_ceres: string;
	user_nik: string;
}

export type TransactionType =
	| 'Auto Maturity Link'
	| 'Tolakan'
	| 'Refund UL'
	| 'Refund Trad'
	| 'Tolakan Trad'
	| 'Major Alteration'
	| 'Minor Alteration'
	| 'Withdrawal'
	| 'Surrender Link'
	| 'Switching'
	| 'Redirection'
	| 'Cancel Free Look Link'
	| 'Pinjaman'
	| 'Deduction'
	| 'Surrender Trad'
	| 'Maturity Trad'
	| 'Maturity Link'
	| 'Cancel Free Look Trad'
	| 'Auto Maturity Trad'
	| 'Top Up UL'
	| 'Churning Polaris'
	| 'Re-Alokasi Investasi'
	| 'Switching and Redirection';
