import { getContext, hasContext, setContext } from 'svelte';

import type { TaskFormProps } from '.';

const key = Symbol('task-form-context');

export function setTaskFormContext(data: TaskFormProps) {
  setContext(key, data);
}

export function getTaskFormContext() {
  if (!hasContext(key)) throw new Error('User context not found');
  return getContext<TaskFormProps>(key);
}
