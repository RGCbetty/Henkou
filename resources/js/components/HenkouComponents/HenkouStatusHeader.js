import React from 'react';
import { Button, Select } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
const { Option } = Select;
export const henkouStatusHeader = (assessment, handleStatus, handleAssessment, handlePending) => [
	{
		title: 'Sequence',
		dataIndex: 'Sequence',
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
		title: 'Department',
		dataIndex: 'Department',
		key: '3',
		align: 'center',
		width: 150,
		fixed: 'left'
	},
	{
		title: 'Section',
		dataIndex: 'Section',
		key: '4',
		align: 'center',
		width: 170,
		fixed: 'left'
	},
	{
		title: 'Team',
		dataIndex: 'Team',
		key: '5',
		align: 'center',
		width: 150,
		fixed: 'left'
	},
	{
		title: 'Product / Process',
		key: '6',
		width: 300,
		dataIndex: 'ProductCategory',
		align: 'center'
	},
	{
		title: 'Assessment',
		key: '7',
		dataIndex: 'assessment_id',
		width: 80,
		align: 'center',
		render: (text, record, index) => {
			return (
				<Select
					defaultValue=""
					value={text}
					onChange={(value) => handleAssessment(value, 'assessment_id', record)}
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
						disabled={row.assessment_id !== 1}
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
				disabled={row.toggleSelect}
				onClick={() => handlePending(row)}
				shape="circle"
				icon={<FieldTimeOutlined />}
			/>
		)
	},
	{
		title: 'Finish',
		key: '10',
		dataIndex: 'finish_date',
		align: 'center',

		width: 150,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={row.toggleStatus}
						onClick={() => handleStatus(row, 'finish_date')}
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
