export interface StatusTrxHistoryRes {
	status_transaksi: {
		created_date: string;
		status_internal: string;
		status_transaksi: string;
	}[];
}

export interface WorkbasketReq {
	pageSize?: number;
	pageNumber?: number;
	caseId?: string;
	noPolis?: string;
	caseTrx?: string;
	statusTrx?: string;
	noTmp?: string;
	lusUser?: string;
	startDate?: string;
	endDate?: string;
}
