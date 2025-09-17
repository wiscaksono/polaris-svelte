import { mutationOptions, api } from '$lib/utils';

import type { User } from '$lib/utils/type';

export const loginQuery = {
  login: () => {
    return mutationOptions({
      mutationFn: async ({ username, password }: { username: string; password: string }) => {
        const { data } = await api.post<User & { token: string }>('/auth/loginNewPolaris', {
          username,
          password
        });

        api.setToken(data.token);

        return data;
      }
    });
  }
};

