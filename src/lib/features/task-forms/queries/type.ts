import type { TrackedData } from "$lib/utils";

export interface TransactionHistoriesRes {
	status_transaksi: Array<{
		created_date: string;
		status_internal: string;
		status_transaksi: string;
	}>;
}

export interface FinancialDataSubmissionRes {
	policyHolderSignature: "1" | "0" | null
	csBcAgentSignature: "1" | "0" | null
	dcNotes: string | null
	submittedDate: string | null
	formDate: string | null
	policyData: {
		kdKurs: string
		lsbsId: number
		lsdbsNumber: number
		subProd: string
		policyHolderName: string
		policyNumber: string
		policyStatus: string
		productName: string
		regSpaj: string
		age: string
		issueDate: string
		agentServicingPolis: string | null
		namaServicingPolis: string | null
		agentPenutupPolis: string | null
		namaPenutupPolis: string | null
	}
	endorsement: TrackedData<{
		accountHolderName: string | null
		accountNumber: string | null
		bankName: string | null
		lsbpId: string | null
		currency: string
		phoneNumber: string | null
		email: string | null
		accountHolderNameId: string | null
		accountNumberId: string | null
		bankNameId: string | null
		bankBranchId: string | null
		currencyId: string | null
		phoneNumberId: string | null
		emailId: string | null
	}>
	reason: Array<{
		notes: string
		reasonId: number
		reasonName: string
	}>
	transactionData: Array<{
		fundCode: string
		fundName: string
		fundType: string
		fundAmount: number
	}>
}
