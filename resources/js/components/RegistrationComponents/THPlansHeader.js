import React, { useState, useEffect } from 'react';

/* Material Design */
import { Button, Tooltip } from 'antd';
import { Select } from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    EyeOutlined,
    FilePdfTwoTone,
    CommentOutlined
} from '@ant-design/icons';
const { Option } = Select;
export const headers = handleClickPDF => [
    {
        title: 'Received Date',
        width: 130,
        dataIndex: 'RequestAcceptedDate',
        key: '1',
        fixed: 'left',
        align: 'center'
    },
    {
        title: 'Customer Code',
        width: 133,
        dataIndex: 'ConstructionCode',
        key: '2',
        fixed: 'left',
        align: 'center'
    },
    {
        title: 'House Code',
        width: 115,
        value: 'NameCode',
        dataIndex: 'NameCode',
        key: '3',
        align: 'center'
    },
    {
        title: 'House Type',
        value: 'ConstructionTypeName',
        dataIndex: 'ConstructionTypeName',
        align: 'center',
        width: 150,
        key: '4'
    },
    {
        title: 'Plan Number',
        width: 120,
        value: 'PlanNo',
        dataIndex: 'PlanNo',
        align: 'center',
        key: '5'
    },
    {
        title: 'TH Number',
        width: 115,
        value: 'RequestNo',
        dataIndex: 'RequestNo',
        align: 'center',
        key: '6'
    },
    {
        title: 'TH View',
        value: 'thview',
        dataIndex: 'thview',
        align: 'center',
        key: '7',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="link"
                    // icon={<PlayCircleOutlined />}
                    onClick={() => handleClickPDF(event, record)}>
                    View PDF
                    <FilePdfTwoTone />
                </Button>
            </Tooltip>
        )
    },
    {
        title: 'Assessment',
        width: 115,
        value: 'assessment',
        dataIndex: 'assessment',
        align: 'center',
        key: '8',
        render: record => {
            return (
                <Select defaultValue="" style={{ width: 180 }}>
                    {record.map((item, index) => {
                        return (
                            <Option key={index} value={index}>
                                {item}
                            </Option>
                        );
                    })}
                </Select>
            );
        }
    },
    {
        title: 'Start',
        width: 65,
        value: 'start',
        dataIndex: 'start',
        align: 'center',
        key: '9',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="primary"
                    onClick={() => handleClickPDF(event, record)}
                    shape="circle"
                    icon={<PlayCircleOutlined />}
                />
            </Tooltip>
        )
    },
    {
        title: 'Pending Start',
        width: 120,
        value: 'pending',
        dataIndex: 'pending',
        align: 'center',
        key: '10',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="primary"
                    onClick={() => handleClickPDF(event, record)}
                    shape="circle"
                    icon={<PlayCircleOutlined />}
                />
            </Tooltip>
        )
    },
    {
        title: 'Reason',
        width: 115,
        value: 'reason',
        dataIndex: 'reason',
        align: 'center',
        key: '11',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="primary"
                    onClick={() => handleClickPDF(event, record)}
                    shape="circle"
                    icon={<CommentOutlined />}
                />
            </Tooltip>
        )
    },
    {
        title: 'Pending Resume',
        width: 145,
        value: 'pendingresume',
        dataIndex: 'pendingresume',
        align: 'center',
        key: '12',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="primary"
                    onClick={() => handleClickPDF(event, record)}
                    shape="circle"
                    icon={<PauseCircleOutlined />}
                />
            </Tooltip>
        )
    },
    {
        title: 'Action',
        width: 115,
        value: 'action',
        dataIndex: 'action',
        align: 'center',
        key: '13',
        render: record => {
            return (
                <Select defaultValue="" style={{ width: 125 }}>
                    {record.map((item, index) => {
                        return (
                            <Option key={index} value={index}>
                                {item}
                            </Option>
                        );
                    })}
                </Select>
            );
        }
    },
    {
        title: 'Finish',
        width: 115,
        value: 'finish',
        dataIndex: 'finish',
        align: 'center',
        key: '14',
        render: (text, record) => (
            <Tooltip title={text}>
                <Button
                    type="primary"
                    onClick={() => handleClickPDF(event, record)}
                    shape="circle"
                    icon={<PauseCircleOutlined />}
                />
            </Tooltip>
        )
    },
    {
        title: 'Days in Process',
        width: 140,
        value: 'daysinprocess',
        dataIndex: 'daysinprocess',
        align: 'center',
        key: '15'
    },
    {
        title: 'Start (Remake)',
        width: 130,
        value: 'ResumedProcessingDate',
        dataIndex: 'ResumedProcessingDate',
        align: 'center',
        key: '16'
    },
    {
        title: 'Remarks',
        width: 115,
        value: 'remarks',
        dataIndex: 'remarks',
        align: 'center',
        key: '17'
    }
];
