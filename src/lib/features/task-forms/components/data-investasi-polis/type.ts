export interface DataInvestasiPolisRes {
	jumlahSwitching: number | null;
	jumlahWithdrawal: number | null;
	lastSwitching: string | null;
	lastWithdrawal: string | null;
	saldoInvestasi: Array<{
		jenisInvestasi: string;
		tanggalNAV: string;
		unitPokok: number;
		unitTopup: number;
		totalUnit: number;
		hargaUnit: number;
		nilaiInvestasi: number;
		kurs: string;
	}>;
}
