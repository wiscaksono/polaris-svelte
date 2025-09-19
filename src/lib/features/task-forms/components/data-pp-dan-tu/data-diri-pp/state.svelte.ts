import type { MajorAlterationTab2Res } from '$lib/features/task-forms/major-alteration/type';

let data = $state<MajorAlterationTab2Res['pemegangPolis'] | undefined>(undefined);

export function setData(newData: MajorAlterationTab2Res['pemegangPolis']) {
	data = newData;
}

export function getData() {
	return data;
}
