import { queryOptions, useQueryClient } from '@tanstack/svelte-query';
import { api, mutationOptions, sleep } from '$lib/utils';

import type { MenuConfigurationListRes, MenuConfigurationListRoleRes } from './type';

export const menuConfigurationQueries = {
	listConfiguration: () => {
		return queryOptions({
			queryKey: ['menu-configuration', 'list-configuration'],
			queryFn: async () => {
				const { data } = await api.get<MenuConfigurationListRes>('/polaris/api-user-pol/major/list-configuration');
				return data;
			}
		});
	},
	listRole: () => {
		return queryOptions({
			queryKey: ['menu-configuration', 'list-role'],
			queryFn: async () => {
				const { data } = await api.get<MenuConfigurationListRoleRes>('/polaris/api-user-pol/major/list-role');
				return data.map((item) => ({
					...item,
					name: item.name.replaceAll('POLARIS', '')
				}));
			}
		});
	},
	toggleRole: () => {
		const queryClient = useQueryClient();

		return mutationOptions({
			mutationFn: async ({
				menuID,
				subMenuID,
				roleID,
				checked
			}: {
				menuID: number | null;
				subMenuID: number | null;
				roleID: number | null;
				checked: boolean;
			}) => {
				await api.put('/polaris/api-user-pol/major/updateListConfiguration', { menuID, subMenuID, roleID, checked });
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: ['menu-configuration', 'list-configuration'] });
			}
		});
	},

	// TODO: Confirm about the endpoint
	createMenu: () => {
		return mutationOptions({
			mutationFn: async (name: string) => {
				await sleep(2000);
				console.log(name, 'Not implemented, missing endpoint');
			}
		});
	},
	createSubMenu: () => {
		return mutationOptions({
			mutationFn: async (name: string) => {
				await sleep(2000);
				console.log(name, 'Not implemented, missing endpoint');
			}
		});
	},
	editMenu: () => {
		return mutationOptions({
			mutationFn: async (name: string) => {
				await sleep(2000);
				console.log(name, 'Not implemented, missing endpoint');
			}
		});
	},
	deleteMenu: () => {
		return mutationOptions({
			mutationFn: async (id: number) => {
				await sleep(2000);
				console.log(id, 'Not implemented, missing endpoint');
			}
		});
	}
};
