import { isEmpty } from 'lodash';

export const PlanCustomerInformation = (details) => [
	{
		title: 'House Code',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.house_code : ''
	},
	{
		title: 'House Type',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.house_type : ''
	},
	{
		title: 'Revision No.',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.rev_no : ''
	},
	{
		title: 'Plan Number',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.plan_no : ''
	},
	{
		title: 'Joutou Date',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.joutou_date : ''
	},
	{
		title: 'TH number',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.th_no : ''
	},
	{
		title: 'Kiso Start',
		width: 250,
		textAlign: 'center',
		value: !isEmpty(details) ? details.construction_schedule.kiso_start : ''
	},
	{
		title: 'View Attachments',
		width: 250,
		textAlign: 'center'
	}
];
