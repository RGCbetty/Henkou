import React from 'react';
import { Tag, Tooltip, Button, Space, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
export const ManageUserColumns = (confirm) => [
	{
		title: 'Employee No.',
		dataIndex: 'EmployeeCode',
		align: 'center',
		key: 'name',
		render: (text) => <b>{text}</b>
	},
	{
		title: 'Employee Name',
		dataIndex: 'EmployeeName',
		align: 'center',
		key: 'age'
	},
	{
		title: 'Department',
		dataIndex: 'DepartmentName',
		align: 'center',
		key: 'address'
	},
	{
		title: 'Section',
		key: 'SectionName',
		align: 'center',
		dataIndex: 'SectionName'
	},
	{
		title: 'Team',
		key: 'TeamName',
		align: 'center',
		dataIndex: 'TeamName'
	},
	{
		title: 'Designation',
		dataIndex: 'DesignationName',
		align: 'center',
		key: 'address'
	},
	{
		title: 'Role',
		key: 'access_level',
		align: 'center',
		dataIndex: 'access_level',
		editable: true
		// render: (role_id) => {
		// 	console.log(role_id);
		// 	return (
		// 		<b>
		// 			{(() => {
		// 				switch (role_id) {
		// 					case 1:
		// 						return 'Administrator';
		// 					case 2:
		// 						return 'Viewer';
		// 					case 3:
		// 						return 'Encoder';

		// 					default:
		// 						return 'N/A';
		// 				}
		// 			})()}
		// 		</b>
		// 	);
		// }
	},
	{
		title: 'Status',
		key: 'is_registered',
		align: 'center',
		dataIndex: 'is_registered',
		render: (text) => (
			<>
				<Tag
					style={{ margin: 0 }}
					icon={text == 1 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
					color={text == 1 ? 'success' : 'error'}>
					{text == 1 ? 'Verified' : 'Not Verified'}
				</Tag>
			</>
		)
	},
	{
		title: 'Action',
		align: 'center',
		key: 'action',
		render: (text, row) => (
			<>
				<Tooltip title="view">
					<Button type="primary" shape="circle" icon={<EyeOutlined />} />
				</Tooltip>
				<Space></Space>
				{!row.is_registered == 1 && (
					<Popconfirm
						title="Are you sure to you want to verify this user?"
						onConfirm={() => confirm(row)}
						// onCancel={cancel}
						placement="left"
						okText="Yes"
						cancelText="No">
						<Tooltip title="Verify">
							<Button
								style={{ marginLeft: 5 }}
								disabled={row.is_registered == 1}
								type="primary"
								shape="circle"
								icon={<CheckCircleOutlined />}
							/>
						</Tooltip>
					</Popconfirm>
				)}
			</>
		)
	}
];
