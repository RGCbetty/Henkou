import React, { useEffect } from 'react';
import { Table } from 'antd';
import { fetchStopPlans, useStopPlanRetriever } from '../api/stop';

const Stop = ({ title }) => {
    useEffect(() => {
        document.title = title || '';
    }, [title]);
    const [stopState, setStop] = useStopPlanRetriever();
    const headers = [
        {
            title: 'Customer Code',
            dataIndex: 'ConstructionCode',
            key: '1',
            align: 'center'
        },
        {
            title: 'House Code',
            dataIndex: 'HouseCode',
            key: '2',
            align: 'center'
        },
        {
            title: 'House Type',
            dataIndex: 'HouseType',
            key: '3',
            align: 'center'
        },
        {
            title: 'Stopped Date',
            dataIndex: 'StopDate',
            key: '4',
            align: 'center'
        },
        {
            title: 'Resumed Date',
            dataIndex: 'ResumeDate',
            key: '5',
            align: 'center'
        }
    ];
    return (
        <Table
            size="small"
            columns={headers}
            bordered
            // pagination={pagination}
            dataSource={stopState}
            scroll={{ x: 'max-content' }}
            onChange={event}
        />
    );
};

export default Stop;
