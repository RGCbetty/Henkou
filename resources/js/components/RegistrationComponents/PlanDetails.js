const planDetails = (details) => {
	return [
		{
			title: 'House Code',
			width: 250,
			name: 'HouseCode',
			textAlign: 'left',
			value: details.house_code
		},
		{
			title: 'Joutou Date',
			width: 300,
			name: 'JoutouDate',
			textAlign: 'center',
			value: details.joutou_date
		},
		{
			title: 'Dodai Invoice',
			width: 250,
			name: 'DodaiInvoice',
			textAlign: 'right',
			value: details.dodai_invoice
		},
		{
			title: 'House Type',
			width: 250,
			name: 'HouseType',
			textAlign: 'left',
			value: details.house_type
		},
		{
			title: 'Days Before Joutou',
			width: 300,
			name: 'DaysBeforeJoutou',
			textAlign: 'center',
			value: details.days_before_joutou
		},
		{
			title: '1F Panel Invoice',
			width: 250,
			name: 'PanelInvoice',
			textAlign: 'right',
			value: details['1F_panel_invoice']
		},
		{
			title: 'No. of Floor',
			width: 250,
			name: 'NoOfFloor',
			textAlign: 'left',
			value: details.floors
		},
		{
			title: 'Kiso Start',
			width: 300,
			name: 'KisoStart',
			textAlign: 'center',
			value: details.kiso_start
		},
		{
			title: '1F Hari Invoice',
			width: 250,
			name: 'HariInvoice',
			textAlign: 'right',
			value: details['1F_hari_invoice']
		},
		{
			title: 'Plan Specification',
			width: 250,
			name: 'PlanSpecification',
			textAlign: 'left',
			value: details.plan_specification
		},
		{
			title: 'Before Kiso Start',
			width: 300,
			name: 'BeforeKisoStart',
			textAlign: 'center',
			value: details.before_kiso_start
		},
		{
			title: '1F IQ Invoice',
			width: 250,
			name: 'IQInvoice',
			textAlign: 'right',
			value: details['1F_iq_invoice']
		},
		{
			title: 'Existing Rev No.',
			width: 250,
			name: 'ExistingRevNo',
			textAlign: 'left',
			value: details.existing_rev_no
		},
		{
			title: 'Plan Status',
			width: 300,
			name: 'PlanStatus',
			textAlign: 'center',
			value: details.plan_status
		},
		{
			title: 'Revision Number',
			width: 250,
			name: 'RevisionNumber',
			textAlign: 'right',
			value: details.rev_no
		}
	];
};

export default planDetails;
