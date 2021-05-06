import { isEmpty } from 'lodash';

export const PlanCustomerInformation = (details) => [
	{
		title: 'House Code',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(details) ? details.house_code : ''
	},
	{
		title: 'Plan Specification',
		width: 300,
		name: 'PlanSpecification',
		textAlign: 'center',
		value: !isEmpty(details) ? details.plan_specification : ''
	},
	{
		title: '1F IQ Invoice',
		width: 300,
		name: 'IQInvoice',
		textAlign: 'right',
		value: !isEmpty(details) ? details.invoice['1f_iq_invoice'] : ''
	},

	{
		title: 'House Type',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(details) ? details.house_type : ''
	},
	{
		title: 'Plan Status',
		width: 300,
		name: 'PlanStatus',
		textAlign: 'center',
		value: !isEmpty(details) ? details.plan_status : ''
	},

	{
		title: '1F Panel Invoice',
		width: 300,
		name: 'PanelInvoice',
		textAlign: 'right',
		value: !isEmpty(details) ? details.invoice['1f_panel_invoice'] : ''
	},
	{
		title: 'No. of Floor',
		width: 250,
		name: 'NoOfFloor',
		textAlign: 'left',
		value: !isEmpty(details) ? details.floors : ''
	},
	{
		title: 'Joutou Date',
		width: 300,
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.joutou_date : ''
	},

	{
		title: 'Dodai Invoice',
		width: 300,
		textAlign: 'right',
		value: !isEmpty(details) ? details.invoice.dodai_invoice : ''
	},
	{
		title: 'Plan Number',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(details) ? details.plan_no : ''
	},

	{
		title: 'Days Before Joutou',
		width: 300,
		name: 'DaysBeforeJoutou',
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.days_before_joutou : ''
	},

	{
		title: '1F Hari Invoice',
		width: 300,
		name: 'HariInvoice',
		textAlign: 'right',
		value: !isEmpty(details) ? details.invoice['1F_hari_invoice'] : ''
	},

	{
		title: 'TH number',
		width: 250,
		textAlign: 'left',
		value: !isEmpty(details) ? details.th_no : ''
	},
	{
		title: 'Kiso Start',
		width: 300,
		name: 'KisoStart',
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.kiso_start : ''
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
		value: !isEmpty(details) ? details.rev_no : ''
	},

	{
		title: 'Days Before Kiso Start',
		width: 300,
		name: 'BeforeKisoStart',
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.days_before_kiso_start : ''
	}
];
