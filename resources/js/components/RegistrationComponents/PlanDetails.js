const planDetails = details => {
    return [
        {
            title: 'House Code',
            width: 200,
            textAlign: 'left',
            value: details.house_code
        },
        {
            title: 'Joutou Date',
            width: 250,
            textAlign: 'center',
            value: details.joutou_date
        },
        {
            title: 'Dodai Invoice',
            width: 250,
            textAlign: 'right',
            value: details.dodai_invoice
        },
        {
            title: 'House Type',
            width: 200,
            textAlign: 'left',
            value: details.house_type
        },
        {
            title: 'Days Before Joutou',
            width: 250,
            textAlign: 'center',
            value: details.days_before_joutou
        },
        {
            title: '1F Panel Invoice',
            width: 250,
            textAlign: 'right',
            value: details['1F_panel_invoice']
        },
        {
            title: 'No. of Floor',
            width: 200,
            textAlign: 'left',
            value: details.floors
        },
        {
            title: 'Kiso Start',
            width: 250,
            textAlign: 'center',
            value: details.kiso_start
        },
        {
            title: '1F Hari Invoice',
            width: 250,
            textAlign: 'right',
            value: details['1F_hari_invoice']
        },
        {
            title: 'Plan Specification',
            width: 250,
            textAlign: 'left',
            value: details.plan_specification
        },
        {
            title: 'Before Kiso Start',
            width: 250,
            textAlign: 'center',
            value: details.before_kiso_start
        },
        {
            title: '1F IQ Invoice',
            width: 250,
            textAlign: 'right',
            value: details['1F_iq_invoice']
        }
    ];
};

export default planDetails;
