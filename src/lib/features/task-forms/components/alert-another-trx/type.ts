export interface AlertAnotherTrxRes {
	listGantunganTrx: Array<{
		REG_SPAJ: string;
		DESCRIPTION: string;
		TYPE_ID: number;
		NO_TRX: string;
		ID_DOC: string;
	}>;
}
