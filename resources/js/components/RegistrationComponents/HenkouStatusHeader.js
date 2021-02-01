import React from 'react';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const headers = [
	{
		title: 'Sequence',
		dataIndex: 'Sequence',
		key: '1',
		width: 70,
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Received Date',
		width: 140,
		dataIndex: 'received_date',
		key: '2',
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Department',
		width: 120,
		dataIndex: 'Department',
		key: '3',
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Section',
		width: 200,
		dataIndex: 'Section',
		key: '4',
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Team',
		width: 150,
		dataIndex: 'Team',
		key: '5',
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Product / Process',
		key: '6',
		width: 300,
		dataIndex: 'ProductCategory',
		align: 'center'
	},
	{
		title: 'Start',
		key: '7',
		width: 150,
		dataIndex: 'start_date',
		align: 'center',
		width: 150,
		render: (text, row, index) => (text ? <b>{text}</b> : <></>)
		// render:
	},
	{
		title: 'Pending',
		key: '8',
		width: 70,
		dataIndex: 'houseType',
		align: 'center',
		render: () => <Button type="primary" shape="circle" icon={<EyeOutlined />} />
	},
	{
		title: 'Finish',
		key: '9',
		dataIndex: 'finish_date',
		align: 'center',
		width: 150,
		render: (text, row, index) => (text ? <b>{text}</b> : <></>)
	},
	{
		title: 'Days in Process',
		key: '10',
		width: 100,
		dataIndex: 'Sequence',
		align: 'center'
	}
];

export default headers;
