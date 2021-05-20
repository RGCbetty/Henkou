import React from 'react';
import { Tag } from 'antd';
const columns = () => [
	{
		title: 'Sequence',
		dataIndex: 'sequence',
		key: 'sequence',
		align: 'center'
	},
	// {
	// 	title: 'Before Sequence',
	// 	dataIndex: 'sequence_no',
	// 	key: 'sequence_no'
	// },
	{
		title: 'Product Name',
		dataIndex: ['product_category', 'product_name'],
		key: 'product_name'
	},
	{
		title: 'Updated By',
		dataIndex: 'updated_by',
		key: 'updated_by'
	},
	,
	{
		title: 'Department',
		width: 120,
		align: 'center',
		dataIndex: ['product_category', 'designations'],
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
		dataIndex: ['product_category', 'designations'],
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
		dataIndex: ['product_category', 'designations'],
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
	}
];

export default columns;
