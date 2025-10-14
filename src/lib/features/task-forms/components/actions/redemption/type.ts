export interface RedemptionReq {
	summary: {
		regSpaj: string;
		ltId: number;
		jlhPremi: number; // total redemption amount
		jlhUnit: number; // total redemption unit
		muLspdId: 46; // sementara diisi 46
		muTahunKe: null; // sementara null
		muPremiKe: null; // sementara null
		muLusId: number; // dari user
		idMobile: string; // trx major atau no trx
		appJenisId: 103; // di hardcode 103 = POLARIS
	};
	biaya: Array<{
		ljbId: number;
		mbuPersen: number;
		mbuJumlah: number;
	}>;
}
