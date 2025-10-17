import * as icon from '@lucide/svelte';
import type { TransactionType, SideMenu, UserRoles } from './type';

export const IS_DEV = import.meta.env.MODE === 'development';

export const SIDE_MENU: SideMenu = [
	{
		title: null,
		subMenu: [
			{
				title: 'Dashboard',
				href: '/',
				icon: icon.LayoutDashboard
			},
			{
				title: 'Data Polis',
				href: '/data-polis',
				icon: icon.FileText
			},
			{
				title: 'Flagged',
				href: '/flagged',
				icon: icon.Flag
			},
			{
				title: 'Reports',
				href: '/reports',
				icon: icon.ChartNoAxesCombined
			},
			{
				title: 'Utility',
				href: '/utility',
				icon: icon.Info
			}
		]
	},
	{
		title: 'Workbasket',
		subMenu: [
			{
				title: 'New Submission',
				href: '/workbasket/new-submission',
				icon: icon.Newspaper
			},
			{
				title: 'Further',
				href: '/workbasket/further',
				icon: icon.ScrollText
			},
			{
				title: 'Filling',
				href: '/workbasket/filling',
				icon: icon.FilePen
			}
		]
	},
	{
		title: 'Approval',
		subMenu: [
			{
				title: 'Detail',
				href: '/approval/detail',
				icon: icon.FileCheck
			},
			{
				title: 'Bulk',
				href: '/approval/bulk',
				icon: icon.ListTodo
			},
			{
				title: 'Escalate TL',
				href: '/approval/escalate-tl',
				icon: icon.FileSliders
			}
		]
	},
	{
		title: 'Data Entry',
		subMenu: [
			{
				title: 'List Transaksi',
				href: '/data-entry/list-transaction',
				icon: icon.ArrowLeftRight
			},
			{
				title: 'Draft',
				href: '/data-entry/draft',
				icon: icon.BookDashed
			},
			{
				title: 'New Document',
				href: '/data-entry/new-document',
				icon: icon.FilePlus
			},
			{
				title: 'Filling',
				href: '/data-entry/filling',
				icon: icon.ClipboardPen
			}
		]
	},
	{
		title: 'Administration',
		subMenu: [
			{
				title: 'Re-assign Task',
				href: '/administration/reassign-task',
				icon: icon.UserRoundCheck
			},
			{
				title: 'Menu Configuration',
				href: '/administration/menu-configuration',
				icon: icon.Cog
			},
			{
				title: 'Dashboard Transaction',
				href: '/administration/dashboard-transaction',
				icon: icon.ReplaceAll
			}
		]
	}
];

export const TRANSACTION_IDS = {
	'Major Alteration': 1,
	'Minor Alteration': 2,
	Withdrawal: 3,
	'Surrender Link': 4,
	Switching: 5,
	Redirection: 6,
	'Cancel Free Look Link': 7,
	Pinjaman: 8,
	Deduction: 9,
	'Surrender Trad': 10,
	'Maturity Trad': 11,
	'Maturity Link': 12,
	'Churning Polaris': 13,
	'Switching and Redirection': 14,
	'Auto Maturity Link': 15,
	'Re-Alokasi Investasi': 16,
	Tolakan: 17,
	'Cancel Free Look Trad': 18,
	'Auto Maturity Trad': 19,
	'Top Up UL': 20,
	'Refund UL': 21,
	'Refund Trad': 22,
	'Tolakan Trad': 23
} as const satisfies Record<TransactionType, number>;

export const USER_ROLES: UserRoles[] = [
	'COO',
	'CEO',
	'POLARIS Analyst Financial',
	'POLARIS Team Leader Financial',
	'POLARIS Analyst Alteration',
	'POLARIS Team Leader Alteration',
	'POLARIS Manager of PAS',
	'POLARIS Head of PAS',
	'POLARIS Head of OPS',
	'POLARIS Guest',
	'POLARIS Document Center',
	'POLARIS Admin'
];
