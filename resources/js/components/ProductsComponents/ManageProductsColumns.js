import React from 'react';
import { Space, Button, Popconfirm, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const headers = (columnSearch, save, cancel, edit, isEditing, editingKey) => [
	{
		title: 'Product',
		width: 300,
		dataIndex: 'product_name',
		key: 'product_name',
		align: 'center',
		fixed: 'left',
		editable: true,
		...columnSearch('product_name', 'Product Name')
	},
	{
		title: 'Department',
		dataIndex: 'department',
		width: 150,
		align: 'center'
		// editable: true
	},
	{
		title: 'Section',
		dataIndex: 'section',
		width: 200,
		align: 'center'
		// editable: true
	},
	{
		title: 'Team',
		dataIndex: 'team',
		width: 200,
		align: 'center'
		// editable: true
	},

	// {
	// 	title: 'Waku Sequence',
	// 	width: 80,
	// 	dataIndex: 'waku_sequence',
	// 	defaultSortOrder: 'ascend',
	// 	align: 'center'
	// },
	// {
	// 	title: 'Jikugumi Sequence',
	// 	width: 80,
	// 	dataIndex: 'jiku_sequence',
	// 	defaultSortOrder: 'ascend',
	// 	align: 'center'
	// },

	{
		title: 'Action',
		width: 100,
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
					{/* <Button size="small" onClick={() => openModal(record)}>
						Set supplier
					</Button> */}
				</Space>
			);
		},
		key: '5',
		align: 'center'
	}
];

export default headers;
