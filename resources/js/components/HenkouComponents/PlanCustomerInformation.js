import { isEmpty } from 'lodash';

export const PlanCustomerInformation = (plan) => [
	{
		title: 'House Code',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(plan) ? plan?.details?.house_code : ''
	},
	{
		title: 'Plan Specification',
		width: 300,
		name: 'PlanSpecification',
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.specification : ''
	},
	{
		title: '1F IQ Invoice',
		width: 300,
		name: 'IQInvoice',
		textAlign: 'right',
		value: !isEmpty(plan) ? plan?.['INVOICE 1F IQ'] : ''
	},

	{
		title: 'House Type',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(plan) ? plan?.details?.house_type : ''
	},
	{
		title: 'Plan Status',
		width: 300,
		name: 'PlanStatus',
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.plan_status?.plan_status_name : ''
	},

	{
		title: '1F Panel Invoice',
		width: 300,
		name: 'PanelInvoice',
		textAlign: 'right',
		value: !isEmpty(plan) ? plan?.['INVOICE PANEL'] : ''
	},
	{
		title: 'No. of Floor',
		width: 250,
		name: 'NoOfFloor',
		textAlign: 'left',
		value: !isEmpty(plan) ? plan?.details?.floors : ''
	},
	{
		title: 'Joutou Date',
		width: 300,
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.details?.construction_schedule?.joutou_date : ''
	},

	{
		title: 'Dodai Invoice',
		width: 300,
		textAlign: 'right',
		value: !isEmpty(plan) ? plan?.['INVOICE DODAI'] : ''
	},
	{
		title: 'Plan Number',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(plan) ? plan.details.plan_no : ''
	},

	{
		title: 'Days Before Joutou',
		width: 300,
		name: 'DaysBeforeJoutou',
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.details?.construction_schedule?.days_before_joutou : ''
	},

	{
		title: '1F Hari Invoice',
		width: 300,
		name: 'HariInvoice',
		textAlign: 'right',
		value: !isEmpty(plan) ? plan?.['INVOICE 1F HARI'] : ''
	},

	{
		title: 'TH number',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(plan) ? plan?.th_no : ''
	},
	{
		title: 'Kiso Start',
		width: 300,
		name: 'KisoStart',
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.details?.construction_schedule?.kiso_start : ''
	},

	{
		title: 'View Attachments',
		width: 250,
		textAlign: 'right'
	},
	{
		title: 'Revision No.',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(plan) ? plan?.rev_no : ''
	},

	{
		title: 'Days Before Kiso Start',
		width: 300,
		name: 'BeforeKisoStart',
		textAlign: 'center',
		value: !isEmpty(plan) ? plan?.details?.construction_schedule?.days_before_kiso_start : ''
	}
];
