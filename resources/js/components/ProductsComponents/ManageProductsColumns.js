import React from 'react';
import { Button, Tag, Popconfirm, Typography } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';

const headers = (columnSearch) => [
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
								id: department.DepartmentCode,
								name: department.DepartmentName
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
								id: section.SectionCode,
								name: section.SectionName
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
								id: team.TeamCode,
								name: team.TeamName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((team) => (
					<Tag color="blue" key={team.id}>
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
		render: (_, record) => (
			<Button
				type="primary"
				onClick={() => handleRegistrationModal(record)}
				shape="circle"
				icon={<HighlightOutlined />}
			/>
		),
		key: '5',
		align: 'center'
	}
];

export default headers;
