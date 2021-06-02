import React from 'react';
import { Button, Select, Tag } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import durationAsString from '../../utils/diffDate';
import moment from 'moment';
const { Option } = Select;
export const henkouStatusHeader = (assessment, actions, checkIfOwner, status, fetchingProducts) => [
	{
		title: 'Sequence',
		dataIndex: ['affected_product', 'sequence_no'],
		key: '1',
		width: 60,
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Received Date',
		dataIndex: 'received_date',
		key: '2',
		align: 'center',
		width: 80,
		fixed: 'left'
	},
	{
		title: 'Product / Process',
		key: '3',
		width: 80,
		dataIndex: ['affected_product', 'product_category', 'product_name'],
		render: (text, row, index) => (
			<b>
				{checkIfOwner(row) ? (
					<Tag color="default">{text}</Tag>
				) : (
					<Tag color="success">{text}</Tag>
				)}
			</b>
		),
		align: 'center',
		fixed: 'left'
	},

	,
	{
		title: 'Department',
		width: 60,
		align: 'center',
		dataIndex: ['affected_product', 'product_category', 'designations'],
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
	},
	{
		title: 'Section',
		width: 60,
		align: 'center',
		dataIndex: ['affected_product', 'product_category', 'designations'],
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
					<Tag key={section.id}>{section.name}</Tag>
				))}
			</>
		),
		key: '7'
	},
	// {
	// 	title: 'Team',
	// 	width: 60,
	// 	align: 'center',
	// 	dataIndex: ['affected_product', 'product_category', 'designations'],
	// 	render: (designations) => (
	// 		<>
	// 			{[
	// 				...new Map(
	// 					designations
	// 						.map(({ team }) => ({
	// 							id: team.TeamCode,
	// 							name: team.TeamName
	// 						}))
	// 						.map((item) => [item['id'], item])
	// 				).values()
	// 			].map((team) => (
	// 				<Tag color="blue" key={team.id}>
	// 					{team.name}
	// 				</Tag>
	// 			))}
	// 		</>
	// 	),
	// 	key: '8'
	// },

	{
		title: 'Assessment',
		key: '5',
		dataIndex: 'assessment_id',
		width: 80,
		align: 'center',
		render: (text, row, index) => {
			return (
				<Select
					defaultValue=""
					value={text}
					disabled={
						!row.received_date ||
						row.start_date ||
						row.finished_date ||
						row.assessment_id ||
						// row.assessment_id == 3 ||
						checkIfOwner(row) ||
						(status.findIndex((el) => el.sequence == row.sequence) == 0
							? !status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									)
							  ].received_date &&
							  status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									)
							  ].assessment_id !== 1
							: //  !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
							// 		.received_date ||
							status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									) - 1
							  ].assessment_id == 1
							? !status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									) - 1
							  ].finished_date
							: !status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									) - 1
							  ].assessment_id
							? true
							: !status[
									status.findIndex(
										(el) =>
											el.affected_product.sequence_no ==
											row.affected_product.sequence_no
									)
							  ].received_date)
					}
					onChange={(value) =>
						actions.handleOnChangeAssessment(value, 'assessment_id', row)
					}
					style={{ width: 130 }}>
					{assessment.map((item, index) => {
						return (
							<Option key={item.id} value={item.id}>
								{item.assessment_name}
							</Option>
						);
					})}
				</Select>
			);
		}
	},
	{
		title: 'Duration',
		key: '8',
		align: 'center',
		width: 70,
		render: (_, row) =>
			isNaN(moment(row.start_date).diff(row.finished_date))
				? ''
				: durationAsString(row.start_date, row.finished_date)
	},
	{
		title: 'Action',
		key: '6',
		align: 'center',
		fixed: 'right',
		width: 50,
		dataIndex: 'action',
		render: (text, row) => (
			<Button
				type="primary"
				disabled={fetchingProducts}
				onClick={() => actions.handleAction(row)}
				shape="circle"
				icon={<FieldTimeOutlined />}
			/>
		)
	}
];
