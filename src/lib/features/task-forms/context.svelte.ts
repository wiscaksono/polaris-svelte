import { getContext, hasContext, setContext } from 'svelte';

import type { TaskFormProps } from '.';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

type Getter<T> = () => T;

export type TaskFormStateProps = {
	taskFormParams: Getter<TaskFormProps['taskFormParams']>;
	currentTaskFormTab: Getter<TaskFormProps['currentTaskFormTab']>;
};

class TaskFormContext {
	readonly props: TaskFormStateProps;
	taskFormParams = $derived.by(() => this.props.taskFormParams());
	currentTaskFormTab = $derived.by(() => this.props.currentTaskFormTab());

	constructor(props: TaskFormStateProps) {
		this.props = props;
	}
}

const key = Symbol('task-form-context');

export function setTaskFormContext(data: TaskFormStateProps) {
	return setContext(key, new TaskFormContext(data));
}

export function getTaskFormContext() {
	if (!hasContext(key)) {
		goto(resolve('/workbasket/new-submission'))
		throw new Error('User context not found')
	};
	return getContext<TaskFormContext>(key);
}
