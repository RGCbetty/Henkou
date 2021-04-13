import React from 'react';
import { Table } from 'antd';
const HomeTable = () => {
	const headers = [
		{
			title: 'Registration Date',
			width: 145,
			align: 'center',
			dataIndex: 'regDate',
			key: '1',
			fixed: 'left'
		},
		{
			title: 'Received Date',
			width: 140,
			align: 'center',
			dataIndex: 'recDate',
			key: '2',
			fixed: 'left'
		},
		{
			title: 'Customer Code',
			width: 100,
			align: 'center',
			key: '3',
			dataIndex: 'customerCode',
			fixed: 'left'
		},
		{
			title: 'Process/Product',
			width: 100,
			align: 'center',
			key: '4',
			dataIndex: 'henkouProcess',
			fixed: 'left'
		},
		{
			title: 'Plan Status',
			width: 100,
			align: 'center',
			key: '5',
			dataIndex: 'planStatus'
		},
		{
			title: 'Department',
			width: 100,
			align: 'center',
			dataIndex: 'department',
			key: '6'
		},
		{
			title: 'Section',
			width: 100,
			align: 'center',
			dataIndex: 'section',
			key: '7'
		},
		{
			title: 'Team',
			width: 100,
			align: 'center',
			dataIndex: 'team',
			key: '8'
		},

		{
			title: 'House Code',
			width: 100,
			align: 'center',
			key: '9',
			dataIndex: 'houseCode'
		},
		{
			title: 'House Type',
			width: 100,
			align: 'center',
			key: '10',
			dataIndex: 'houseType'
		},
		{
			title: 'Henkou Type',
			width: 100,
			align: 'center',
			key: '11',
			dataIndex: 'henkouType'
		},
		{
			title: 'TH Number',
			width: 100,
			align: 'center',
			key: '12',
			dataIndex: 'thNumber'
		},
		{
			title: 'Plan Number',
			width: 100,
			align: 'center',
			key: '13',
			dataIndex: 'planNumber'
		},
		{
			title: 'Revision No',
			width: 100,
			align: 'center',
			key: '14',
			dataIndex: 'revNo'
		},
		{
			title: 'Henkou Reason',
			width: 100,
			align: 'center',
			key: '15',
			dataIndex: 'henkouReason'
		},
		{
			title: 'Henkou Details',
			width: 100,
			align: 'center',
			key: '16',
			dataIndex: 'henkouDetails'
		},

		{
			title: 'Joutou Date',
			width: 100,
			align: 'center',
			key: '17',
			dataIndex: 'joutouDate'
		},
		{
			title: 'Days before Joutou',
			width: 100,
			align: 'center',
			key: '18',
			dataIndex: 'daysBeforeJoutou'
		},
		{
			title: 'Kiso Start Date',
			width: 100,
			align: 'center',
			key: '19',
			dataIndex: 'kisoStartDate'
		},
		{
			title: 'Days before Kiso Start',
			width: 100,
			align: 'center',
			key: '20',
			dataIndex: 'daysBeforeKisoStart'
		},
		{
			title: 'Henkou Start Date',
			width: 100,
			align: 'center',
			key: '21',
			dataIndex: 'henkouStartDate'
		},
		{
			title: 'Henkou Finish Date',
			width: 100,
			align: 'center',
			key: '22',
			dataIndex: 'henkouFinishDate'
		},
		{
			title: 'Days in Process',
			width: 100,
			align: 'center',
			key: '23',
			dataIndex: 'daysInProcess'
		},
		{
			title: 'Pending Reason',
			width: 100,
			align: 'center',
			key: '24',
			dataIndex: 'pendingReason'
		}
	];
	// const columns = [
	//     {
	//         title: 'Full Name',
	//         width: 100,
	//         dataIndex: 'name',
	//         key: 'name',
	//         fixed: 'left'
	//     },
	//     {
	//         title: 'Age',
	//         width: 100,
	//         dataIndex: 'age',
	//         key: 'age',
	//         fixed: 'left'
	//     },
	//     { title: 'Column 1', dataIndex: 'address', key: '1' },
	//     { title: 'Column 2', dataIndex: 'address', key: '2' },
	//     { title: 'Column 3', dataIndex: 'address', key: '3' },
	//     { title: 'Column 4', dataIndex: 'address', key: '4' },
	//     { title: 'Column 5', dataIndex: 'address', key: '5' },
	//     { title: 'Column 6', dataIndex: 'address', key: '6' },
	//     { title: 'Column 7', dataIndex: 'address', key: '7' },
	//     { title: 'Column 8', dataIndex: 'address', key: '8' },
	//     {
	//         title: 'Action',
	//         key: 'operation',
	//         fixed: 'right',
	//         width: 100,
	//         render: () => <a>action</a>
	//     }
	// ];

	const data = [
		{
			key: '1',
			regDate: 'yyyy-mm-dd',
			recDate: 'yyyy-mm-dd',
			department: 'Dept A',
			section: 'Sect A',
			team: 'Team A',
			customerCode: '1111111-1111',
			houseCode: 'H1234',
			houseType: 'i-Smart',
			henkouType: 'TH',
			thNumber: 'TH link',
			planNumber: '2-1A',
			revNo: '3-1',
			henkouReason: "Planner's Request",
			henkouDetails: 'VIEW',
			henkouProcess: 'Product Category / Process',
			joutouDate: 'yyyy-mm-dd',
			daysBeforeJoutou: '75',
			kisoStartDate: 'yyyy-mm-dd',
			daysBeforeKisoStart: '34',
			henkouStartDate: 'yyyy-mm-dd',
			henkouFinishDate: 'yyyy-mm-dd',
			daysInProcess: '24',
			pendingReason: 'VIEW'
		},
		{
			key: '2',
			regDate: 'yyyy-mm-dd',
			recDate: 'yyyy-mm-dd',
			department: 'Dept A',
			section: 'Sect A',
			team: 'Team A',
			customerCode: '1111111-1111',
			houseCode: 'H1234',
			houseType: 'i-Smart',
			henkouType: 'TH',
			thNumber: 'TH link',
			planNumber: '2-1A',
			revNo: '3-1',
			henkouReason: "Planner's Request",
			henkouDetails: 'VIEW',
			henkouProcess: 'Product Category / Process',
			joutouDate: 'yyyy-mm-dd',
			daysBeforeJoutou: '75',
			kisoStartDate: 'yyyy-mm-dd',
			daysBeforeKisoStart: '34',
			henkouStartDate: 'yyyy-mm-dd',
			henkouFinishDate: 'yyyy-mm-dd',
			daysInProcess: '24',
			pendingReason: 'VIEW'
		},
		{
			key: '3',
			regDate: 'yyyy-mm-dd',
			recDate: 'yyyy-mm-dd',
			department: 'Dept A',
			section: 'Sect A',
			team: 'Team A',
			customerCode: '1111111-1111',
			houseCode: 'H1234',
			houseType: 'i-Smart',
			henkouType: 'TH',
			thNumber: 'TH link',
			planNumber: '2-1A',
			revNo: '3-1',
			henkouReason: "Planner's Request",
			henkouDetails: 'VIEW',
			henkouProcess: 'Product Category / Process',
			joutouDate: 'yyyy-mm-dd',
			daysBeforeJoutou: '75',
			kisoStartDate: 'yyyy-mm-dd',
			daysBeforeKisoStart: '34',
			henkouStartDate: 'yyyy-mm-dd',
			henkouFinishDate: 'yyyy-mm-dd',
			daysInProcess: '24',
			pendingReason: 'VIEW'
		}
	];

	return (
		<Table
			style={{ marginTop: 10 }}
			columns={headers}
			bordered
			dataSource={data}
			scroll={{ x: 'max-content' }}
		/>
	);
};

export default HomeTable;
