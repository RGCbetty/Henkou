import React from 'react';
import { Button, Select, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
const { Option } = Select;
export const henkouStatusHeader = (
	assessment,
	handleStatus,
	handleAssessment,
	handlePending,
	checkIfSupplier
) => [
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
		dataIndex: 'received_date',
		key: '2',
		align: 'center',
		width: 120,
		fixed: 'left'
	},
	{
		title: 'Product / Process',
		key: '3',
		width: 300,
		dataIndex: 'product_name',
		render: (text, row, index) => (
			<b>
				{checkIfSupplier(row) ? (
					<Tag color="default">{text}</Tag>
				) : (
					<Tag color="success">{text}</Tag>
				)}
			</b>
		),
		align: 'center',
		fixed: 'left'
	},

	{
		title: 'Department',
		dataIndex: 'department',
		key: '4',
		align: 'center',
		width: 150
	},
	{
		title: 'Section',
		dataIndex: 'section',
		key: '5',
		align: 'center',
		width: 170
	},
	{
		title: 'Team',
		dataIndex: 'team',
		key: '6',
		align: 'center',
		width: 150
	},

	{
		title: 'Assessment',
		key: '7',
		dataIndex: 'assessment_id',
		width: 80,
		align: 'center',
		render: (text, row, index) => {
			return (
				<Select
					defaultValue=""
					value={text}
					disabled={(!row.received_date, checkIfSupplier(row))}
					onChange={(value) => handleAssessment(value, 'assessment_id', row)}
					style={{ width: 175 }}>
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
	// <PauseCircleOutlined />
	{
		title: 'Start',
		key: '8',
		dataIndex: 'start_date',
		align: 'center',
		width: 150,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={(checkIfSupplier(row), !row.received_date)}
						// disabled={row.assessment_id !== 1}
						onClick={() => handleStatus(row, 'start_date')}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</>
			)
	},
	{
		title: 'Pending',
		key: '9',
		dataIndex: 'pending',
		align: 'center',
		width: 70,
		render: (text, row) => (
			<Button
				type="primary"
				disabled={(row.toggleSelect, !row.received_date, checkIfSupplier(row))}
				onClick={() => handlePending(row)}
				shape="circle"
				icon={<FieldTimeOutlined />}
			/>
		)
	},
	{
		title: 'Finish',
		key: '10',
		dataIndex: 'finished_date',
		align: 'center',

		width: 150,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={(!row.start_date, checkIfSupplier(row), !row.received_date)}
						onClick={() => handleStatus(row, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</>
			)
	},
	{
		title: 'Days in Process',
		key: '11',
		align: 'center',
		width: 100,
		dataIndex: 'days_in_process'
	},
	{
		title: 'Henkou Details',
		key: '12',
		align: 'center',
		width: 100,
		dataIndex: 'logs'
	}
];
