import React from 'react';
import { Button, Tag, Popconfirm } from 'antd';
import { HighlightOutlined, DeleteOutlined } from '@ant-design/icons';
const headers = (columnSearch, events, visiblePopConfirm, isDeleting) => [
	{
		title: 'Product',
		width: 200,
		dataIndex: 'product_name',
		key: 'product_name',
		align: 'center',
		fixed: 'left',
		editable: true,
		...columnSearch('product_name', 'Product Name')
	},
	{
		title: 'Department',
		width: 120,
		align: 'center',
		dataIndex: 'designations',
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ department }) => ({
								id: department?.DepartmentCode,
								name: department?.DepartmentName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((department) => (
					<Tag color="blue" key={department.id}>
						{department.name}
					</Tag>
				))}
			</>
		),
		key: '6'
	},
	{
		title: 'Section',
		width: 120,
		align: 'center',
		dataIndex: 'designations',
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ section }) => ({
								id: section?.SectionCode,
								name: section?.SectionName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((section) => (
					<Tag color="blue" key={section.id}>
						{section.name}
					</Tag>
				))}
			</>
		),
		key: '7'
	},
	{
		title: 'Team',
		width: 120,
		align: 'center',
		dataIndex: 'designations',
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ team }) => ({
								id: team?.TeamCode,
								name: team?.TeamName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((team, index) => (
					<Tag color="blue" key={team?.id ? team.id : index}>
						{team.name}
					</Tag>
				))}
			</>
		),
		key: '8'
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
			const deletable = isDeleting(record);
			return deletable ? (
				<>
					{/* <Button
						type="primary"
						onClick={() => events.handleEditProduct(record)}
						style={{ margin: 5 }}
						shape="circle"
						icon={<HighlightOutlined />}
					/> */}
					<Popconfirm
						title="Are you sure to delete this product?"
						onConfirm={() => events.onPopConfirmOk(record)}
						onCancel={events.onPopConfirmCancel}
						visible={visiblePopConfirm}
						okText="Yes"
						cancelText="No">
						<Button
							type="primary"
							onClick={() => events.handleDeleteProduct(record)}
							shape="circle"
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			) : (
				<>
					<Button
						type="primary"
						onClick={() => events.handleEditProduct(record)}
						style={{ margin: 5 }}
						shape="circle"
						icon={<HighlightOutlined />}
					/>
					<Button
						type="primary"
						onClick={() => events.handleDeleteProduct(record)}
						shape="circle"
						icon={<DeleteOutlined />}
					/>
				</>
			);
		},
		key: '5',
		align: 'center'
	}
];

export default headers;
