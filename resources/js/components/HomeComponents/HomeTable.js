import React from 'react';
import { Table } from 'antd';
const HomeTable = () => {
    const headers = [
        {
            title: 'Registration Date',
            width: 145,
            dataIndex: 'regDate',
            key: '1',
            fixed: 'left'
        },
        {
            title: 'Received Date',
            width: 140,
            dataIndex: 'recDate',
            key: '2',
            fixed: 'left'
        },
        {
            title: 'Department',
            width: 100,
            dataIndex: 'department',
            key: '3',
            fixed: 'left'
        },
        {
            title: 'Section',
            width: 100,
            dataIndex: 'section',
            key: '4',
            fixed: 'left'
        },
        {
            title: 'Team',
            width: 100,
            dataIndex: 'team',
            key: '5',
            fixed: 'left'
        },
        {
            title: 'Customer Code',
            key: '6',
            dataIndex: 'customerCode'
        },
        {
            title: 'House Code',
            key: '7',
            dataIndex: 'houseCode'
        },
        {
            title: 'House Type',
            key: '8',
            dataIndex: 'houseType'
        },
        {
            title: 'Henkou Type',
            key: '9',
            dataIndex: 'henkouType'
        },
        {
            title: 'TH Number',
            key: '10',
            dataIndex: 'thNumber'
        },
        {
            title: 'Plan Number',
            key: '11',
            dataIndex: 'planNumber'
        },
        {
            title: 'Revision No',
            key: '12',
            dataIndex: 'revNo'
        },
        {
            title: 'Henkou Reason',
            key: '13',
            dataIndex: 'henkouReason'
        },
        {
            title: 'Henkou Details',
            key: '14',
            dataIndex: 'henkouDetails'
        },
        {
            title: 'Henkou Process',
            key: '14',
            dataIndex: 'henkouProcess'
        },

        {
            title: 'Joutou Date',
            key: '15',
            dataIndex: 'joutouDate'
        },
        {
            title: 'Days before Joutou',
            key: '16',
            dataIndex: 'daysBeforeJoutou'
        },
        {
            title: 'Kiso Start Date',
            key: '17',
            dataIndex: 'kisoStartDate'
        },
        {
            title: 'Days before Kiso Start',
            key: '18',
            dataIndex: 'daysBeforeKisoStart'
        },
        {
            title: 'Henkou Start Date',
            key: '19',
            dataIndex: 'henkouStartDate'
        },
        {
            title: 'Henkou Finish Date',
            key: '19',
            dataIndex: 'henkouFinishDate'
        },
        {
            title: 'Days in Process',
            key: '20',
            dataIndex: 'daysInProcess'
        },
        {
            title: 'Pending Reason',
            key: '21',
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
