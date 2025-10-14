import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
import { getContext, hasContext, setContext } from 'svelte';

import { taskFormQueries } from './queries';

import type { TaskFormProps } from '.';

type Getter<T> = () => T;

export type TaskFormStateProps = {
	taskFormParams: Getter<TaskFormProps['taskFormParams']>;
	currentTaskFormTab: Getter<TaskFormProps['currentTaskFormTab']>;
	currentTaskFormRightTabs: Getter<TaskFormProps['currentTaskFormRightTabs']>;
};

class TaskFormContext {
	private props: TaskFormStateProps;
	readonly isReUnderwriting: CreateQueryResult<boolean>;
	taskFormParams = $derived.by(() => this.props.taskFormParams());
	currentTaskFormTab = $derived.by(() => this.props.currentTaskFormTab());
	currentTaskFormRightTabs = $derived.by(() => this.props.currentTaskFormRightTabs());

	constructor(props: TaskFormStateProps) {
		this.props = props;
		this.isReUnderwriting = createQuery(() => ({
			...taskFormQueries.checkIsReUnderwriting({ noTrx: props.taskFormParams().no_trx }),
			enabled: props.taskFormParams().case_trx === 'Major Alteration'
		}));
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
