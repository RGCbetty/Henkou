import React from 'react';
import { Tag } from 'antd';

const columns = [
	{
		title: 'Process/Product',
		dataIndex: ['product_category', 'product_name']
		// render: (text, record) => console.log(text)
	},
	{
		title: 'Assessment',
		dataIndex: 'assessment',
		render: (text, record) => (text ? 'Affected' : 'No Work')
	},

	// {
	// 	title: 'Sequence',
	// 	dataIndex: 'sequence_no'
	// },

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
					<Tag key={department.id}>{department.name}</Tag>
				))}
			</>
		),
		key: '6'
	}
	// {
	// 	title: 'Section',
	// 	width: 120,
	// 	align: 'center',
	// 	dataIndex: ['product_category', 'designations'],
	// 	render: (designations) => (
	// 		<>
	// 			{[
	// 				...new Map(
	// 					designations
	// 						.map(({ section }) => ({
	// 							id: section.SectionCode,
	// 							name: section.SectionName
	// 						}))
	// 						.map((item) => [item['id'], item])
	// 				).values()
	// 			].map((section) => (
	// 				<Tag key={section.id}>{section.name}</Tag>
	// 			))}
	// 		</>
	// 	),
	// 	key: '7'
	// }
];
export default columns;
