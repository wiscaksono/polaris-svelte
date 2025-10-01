import { PersistedState } from 'runed';

import type { User } from '$lib/utils/type';

export const userStore = new PersistedState<User | null>('user', null);
