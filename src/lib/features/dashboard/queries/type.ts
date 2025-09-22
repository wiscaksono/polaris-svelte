export interface TotalCaseRes {
	allTime: { totalCase: number; newCase: number; inProgress: number; pending: number };
	today: TotalCaseRes['allTime'];
	percentageToday: string;
}

export interface TotalCaseDetailRes {
	totalData: number;
	pageNumber: number;
	totalPage: number;
	pageSize: number;
	content: {
		kind: string;
		statusTrx: number;
		noPolis: string;
		caseTrx: string;
		caseId: string;
		noTmp: string;
		noTrx: string;
		regSpaj: string;
		namaUser: string;
		idDocTmp: string;
		fromApp: string;
		createdAt: string;
	}[];
}

export interface TotalCaseDiffRes {
	summary: {
		week: string;
		lastMonth: number;
		thisMonth: number;
	}[];
}

export interface SlaPerformanceRes {
	dataList: {
		lusId: number;
		fullName: string;
		initials: string;
		team: string;
		jabatan: string;
		totalSeconds?: number;
		totalDocuments: number;
		avgTotalSeconds?: number;
		image: string;
	}[];
}

export interface SlaPerformanceDetailRes {
	totalCase: number;
	completedCase: number;
	avgCase: number;
	chart: {
		date: string;
		cases: number;
		sla?: number;
	}[];
}

export type ByDistributionChannelRes = Array<{
	date: string;
	orion: number;
	polaris: number;
	vega: number;
}>;

export type DynamicData = Array<{ date: Date } & Record<string, string | number>>;

export interface ByTransactionTypeRes {
	summaryAlterationTransaction: DynamicData;
	summaryFinancialTransaction: DynamicData;
}
