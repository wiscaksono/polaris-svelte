import { mutationOptions, api } from '$lib/utils';

import type { ListMenuRes } from './type';
import type { User } from '$lib/utils/type';

export const loginQueries = {
  login: () => {
    return mutationOptions({
      mutationFn: async ({ username, password }: { username: string; password: string }) => {
        const { data: user } = await api.post<User & { token: string }>('/auth/loginNewPolaris', { username, password });
        api.setToken(user.token);
        const { data: userMenu } = await api.get<ListMenuRes>(`/polaris/api-user-pol/general/list-menu`)

        return { user, userMenu };
      }
    });
  }
};

