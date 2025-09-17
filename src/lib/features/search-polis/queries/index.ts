import { api } from '$lib/utils/api';
import { queryOptions } from '@tanstack/svelte-query';

export const searchPolisQueries = {
  list: () => {
    return queryOptions({
      queryKey: ['search-polis', 'list'],
      queryFn: async () => {
        const { data } = await api.get('TODO');
        return data;
      }
    });
  }
};

