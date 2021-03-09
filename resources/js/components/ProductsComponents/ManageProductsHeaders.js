import React from 'react';
import { Space, Button, Popconfirm, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const headers = (columnSearch, save, cancel, edit, isEditing, editingKey, openModal) => [
	{
		title: 'Product',
		width: 300,
		dataIndex: 'product_name',
		key: 'product_name',
		align: 'center',
		fixed: 'left',
		editable: true,
		...columnSearch('product_name', 'Product')
	},
	{
		title: 'Department',
		dataIndex: 'department',
		width: 150,
		align: 'center',
		editable: true,
		...columnSearch('department', 'Department')
	},
	{
		title: 'Section',
		dataIndex: 'section',
		width: 250,
		align: 'center',
		editable: true,
		...columnSearch('section', 'Section')
	},
	{
		title: 'Team',
		dataIndex: 'team',
		width: 200,
		align: 'center',
		editable: true,
		...columnSearch('team', 'Team')
	},

	{
		title: 'Waku Sequence',
		width: 110,
		dataIndex: 'waku_sequence',
		defaultSortOrder: 'ascend',
		sorter: (a, b) => a.waku_sequence - b.waku_sequence,
		align: 'center'
	},
	{
		title: 'Jikugumi Sequence',
		width: 110,
		dataIndex: 'jiku_sequence',
		defaultSortOrder: 'ascend',
		sorter: (a, b) => a.jiku_sequence - b.jiku_sequence,
		align: 'center'
	},
	{
		title: 'No. of Suppliers',
		width: 110,
		dataIndex: 'count',
		align: 'center'
	},

	{
		title: 'Main Supplier',
		width: 200,
		dataIndex: 'main_supplier',
		align: 'center'
	},
	{
		title: 'Action',
		width: 200,
		dataIndex: 'action',
		fixed: 'right',
		render: (_, record) => {
			const editable = isEditing(record);
			return editable ? (
				<Space size="middle">
					<a
						href="#"
						onClick={() => save(record.key)}
						style={{
							marginRight: 8
						}}>
						Save
					</a>
					<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
						<a>Cancel</a>
					</Popconfirm>
				</Space>
			) : (
				<Space size="middle">
					<Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
						Edit
					</Typography.Link>
					<Button size="small" onClick={() => openModal(record)}>
						Set supplier
					</Button>
				</Space>
			);
		},
		key: '5',
		align: 'center'
	}
];

export default headers;
