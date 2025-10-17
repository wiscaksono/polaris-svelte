import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
import { getContext, hasContext, setContext } from 'svelte';

import { taskFormQueries } from './queries';

import type { TaskFormProps } from '.';
import { userStore } from '$lib/stores';

type Getter<T> = () => T;

export type TaskFormStateProps = {
	taskFormParams: Getter<TaskFormProps['taskFormParams']>;
	currentTaskFormTab: Getter<TaskFormProps['currentTaskFormTab']>;
	currentTaskFormRightTabs: Getter<TaskFormProps['currentTaskFormRightTabs']>;
};

export type TaskFormMeta = {
	isActionAllowed: boolean;
}

class TaskFormContext {
	private props: TaskFormStateProps;
	readonly isReUnderwriting: CreateQueryResult<boolean>;
	readonly meta: TaskFormMeta;
	taskFormParams = $derived.by(() => this.props.taskFormParams());
	currentTaskFormTab = $derived.by(() => this.props.currentTaskFormTab());
	currentTaskFormRightTabs = $derived.by(() => this.props.currentTaskFormRightTabs());

	constructor(props: TaskFormStateProps) {
		this.props = props;
		this.isReUnderwriting = createQuery(() => ({
			...taskFormQueries.checkIsReUnderwriting({ noTrx: props.taskFormParams().no_trx }),
			enabled: props.taskFormParams().case_trx === 'Major Alteration'
		}));
		this.meta = $derived.by(() => {
			return {
				isActionAllowed: this.getActionPermission()
			}
		})
	}

	private getActionPermission() {
		if (this.taskFormParams.kind === 'Filling') return false;
		if (userStore.current!.role_name === 'POLARIS Guest') return false;
		if (this.currentTaskFormTab.slug === 'worksheet') return false;
		if (this.taskFormParams.kind === 'New Submission') return true;
		if (userStore.current!.role_name === 'POLARIS Admin') return true;
		if (userStore.current!.role_name.includes('Team Leader')) return true;
		if (this.taskFormParams.nama_user === userStore.current!.user_full_name) return true;

		return false;
	}
}

const key = Symbol('task-form-context');

export function setTaskFormContext(data: TaskFormStateProps) {
	return setContext(key, new TaskFormContext(data));
}

export function getTaskFormContext() {
	if (!hasContext(key)) {
		goto(resolve('/workbasket/new-submission'));
		throw new Error('User context not found');
	}
	return getContext<TaskFormContext>(key);
}
