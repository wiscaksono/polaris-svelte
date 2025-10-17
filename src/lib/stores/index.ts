import { PersistedState } from 'runed';

import type { User } from '$lib/utils/type';
import type { ListMenuRes } from '$lib/features/login/type';

export const userStore = new PersistedState<User | null>('user', null);

export const menuStore = new PersistedState<ListMenuRes | null>('menu', null);
