import React from 'react';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const headers = [
	{
		title: 'Sequence',
		dataIndex: 'sequence',
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
		title: 'Product / Process',
		key: '3',
		width: 300,
		dataIndex: 'product_name',
		align: 'center',
		fixed: 'left'
	},

	{
		title: 'Department',
		width: 120,
		dataIndex: 'department',
		key: '4',
		align: 'center'
	},
	{
		title: 'Section',
		width: 200,
		dataIndex: 'section',
		key: '5',
		align: 'center'
	},
	{
		title: 'Team',
		width: 150,
		dataIndex: 'team',
		key: '6',
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
		dataIndex: 'house_type',
		align: 'center',
		render: () => <Button type="primary" shape="circle" icon={<EyeOutlined />} />
	},
	{
		title: 'Finish',
		key: '9',
		dataIndex: 'finished_date',
		align: 'center',
		width: 150,
		render: (text, row, index) => (text ? <b>{text}</b> : <></>)
	},
	{
		title: 'Days in Process',
		key: '10',
		width: 100,
		dataIndex: 'sequence',
		align: 'center'
	}
];

export default headers;
