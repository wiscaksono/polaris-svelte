import * as icon from '@lucide/svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { Component } from 'svelte';
import type { ListMenu } from '$lib/type';

// Precompute menu and submenu maps for faster lookups
export const menuMap = new SvelteMap<number, { icon: Component<icon.IconProps>; href?: string }>([
	[1, { icon: icon.House, href: '/' }],
	[2, { icon: icon.FileText, href: '/data-polis' }],
	[3, { icon: icon.MailOpen }],
	[4, { icon: icon.SquareCheck }],
	[5, { icon: icon.Flag, href: '/flagged' }],
	[6, { icon: icon.FileText, href: '/reports' }],
	[7, { icon: icon.ClipboardList }],
	[8, { icon: icon.Users }],
	[9, { icon: icon.Settings, href: '/utility' }]
]);

interface Menu {
	id: number;
	name: string;
	icon: Component<icon.IconProps>;
	href?: string;
}

export const convertMenu = (listMenu: ListMenu[]): Menu[] => {
	return listMenu
		.map((menu) => {
			const mainMenu = menuMap.get(menu.id);
			if (!mainMenu) return null; // Skip invalid menus

			return {
				id: menu.id,
				name: menu.name,
				icon: mainMenu?.icon,
				href: mainMenu?.href
			};
		})
		.filter(Boolean) as Menu[];
};
