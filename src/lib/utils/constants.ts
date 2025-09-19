import * as icon from '@lucide/svelte';

export const sideMenu = [
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
