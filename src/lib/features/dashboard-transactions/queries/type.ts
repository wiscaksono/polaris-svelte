export interface DashboardTransactionsRes {
	overview: {
		totalTransaction: number;
		avgProcessingTime: number;
		issuesDetected: number;
		mostCommonType: string;
	};
	processingTime: {
		average: Array<{ key: string; value: number }>;
		heatmap: Array<{ key: string; value: number }>;
		trend: Array<Record<string, number>>;
	};
	transactionType: {
		average: Array<Record<string, number>>;
	};
	trendsAndComparison: {
		stage: Array<Record<string, string | number> & { date: string }>;
		issue: Array<{ stage: string; issues: number; fill: string }>;
		monthly: Array<{ stage: string; lastMonth: number; thisMonth: number }>;
	};
}

export interface DashboardTransactionsDetailRes {
	transaction: Array<{
		transaksi: string;
		no_polis: string;
		no_trx: string;
		tgl_submit: string;
		etl: number | null;
		aml: number | null;
		spica: number | null;
		pending_spica: number | null;
		task_distribution: number | null;
		redemption: number | null;
		payment: number | null;
	}>;
}
