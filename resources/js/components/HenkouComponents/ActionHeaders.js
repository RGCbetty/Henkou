import React from 'react';
import { Button, Select, Input } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

const { TextArea } = Input;

const ActionHeaders = (handleStatus, handleReasonInput) => [
	{
		title: 'No.',
		dataIndex: 'id',
		key: '1',
		width: 70,
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Section',
		dataIndex: 'section',
		key: '2',
		align: 'center',
		width: 120,
		fixed: 'left'
	},
	{
		title: 'Team',
		key: '3',
		dataIndex: 'team',
		align: 'center',
		width: 150
	},
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
						disabled={(!row.received_date, checkIfSupplier(row))}
						// disabled={row.assessment_id !== 1}
						onClick={() => handleStatus(row, 'start_date')}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</>
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
						disabled={(!row.start_date, !row.received_date, checkIfSupplier(row))}
						onClick={() => handleStatus(row, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</>
			)
	},

	{
		title: 'Duration',
		key: '6',
		dataIndex: 'days_in_process',
		align: 'center',
		width: 70
	},
	{
		title: 'Henkou Details',
		key: '7',
		dataIndex: 'duration',
		align: 'center',
		width: 70
	}
];
export default ActionHeaders;
