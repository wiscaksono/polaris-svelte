export type ApproveButtonStateRes = {
	button_approval: boolean;
	need_illustration: boolean;
} | null;

export interface ApproveButtonLimitValidationRes {
	approvable: boolean;
	message: string;
}
