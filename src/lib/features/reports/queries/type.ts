export type ReportsTransactionListRes = Array<{
	trxId: number;
	ltId: number | null;
	description: string;
}>;

export type ReportTransactionRes = Array<{
	noPolicy: string;
	transaction: string;
	noTransaction: string;
	statusTransaction: string;
	submitDate: string;
	lastApprovalDate: string | null;
	sendAqua: string | null;
	navDate: string | null;
	fund: string;
	amount: number;
	unit: number;
	hargaUnit: number;
	biaya: number;
	paymentInstruction: string | null;
	paymentDate: string | null;
	journalCreatedDate: string | null;
	journalAccrual: string | null;
	journalUangKeluar: string | null;
	journalUangMasuk: string | null;
}>;

export type ReportFinancialRes = Array<{
	policyNo: string;
	policyStatus: string;
	policyHolderName: string;
	dob: string;
	product: string;
	begDate: string;
	endDate: string;
	transactionType: string;
	transactionDate: string;
	incomingTrx: string;
	caseID: number;
	transactionNo: string;
	posisi: string;
	validationDate: string | null;
	user: string;
	amountRedempt: number;
	unitRedempt: number;
	biaya: number;
	sendAqua?: string;
	sendPandora?: string;
	navDate?: string;
	kurs: string;
	amountTransfer: number;
	transferDate: string | null;
	bankName: string | null;
	accountNumber: string | null;
	accountName: string | null;
	servicingAgentCode: string;
	servicingAgentName: string;
	region: string | null;
	jalurDistribusi: string;
	reasonWithdraw: string | null;
}>;

export interface ReportReconcileInvestasiRes {
	periodeFrom: string;
	periodeTo: string;
	transaction: string;
	reportListRs: Array<{
		// POLARIS
		nopol: string;
		fund: string;
		unit: number;
		amount: number;
		tanggal: string;
		jenis_transaksi: string | null;
	}>;
	resultListRs: ReportReconcileInvestasiRes['reportListRs']; // AQUARIUS
	totalPolis: number;
	totalAmount: number;
	totalUnit: number;
	totalPolisAquarius: number;
	totalAmountAquarius: number;
	totalUnitAquarius: number;
}
