export type MenuConfigurationListRes = Array<{
	id: number;
	name: string;
	roleId: number[];
	sub: Array<{
		id: number;
		name: string;
		roleId: number[];
	}> | null;
}>;

export type MenuConfigurationListRoleRes = Array<{
	role_id: number;
	name: string;
}>;
