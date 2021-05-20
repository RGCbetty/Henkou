import React from 'react';
import { Button, Select, Input, Tooltip, AutoComplete } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

const { TextArea } = Input;

const ActionHeaders = (
	handleActionStatus,
	handleActionDetails,
	handleActionPending,
	checkIfOwner,
	pendingItems
) => [
	{
		title: 'No.',
		dataIndex: 'status_index',
		key: '1',
		width: 30,
		align: 'center'
	},

	{
		title: 'Updated By',
		key: '2',
		dataIndex: ['employee', 'EmployeeName'],
		align: 'center',
		width: 130
	},
	{
		title: 'Department',
		dataIndex: ['employee', 'department', 'DepartmentName'],
		key: '3',
		align: 'center',
		width: 130
	},
	{
		title: 'Section',
		dataIndex: ['employee', 'section', 'SectionName'],
		key: '3',
		align: 'center',
		width: 130
	},
	{
		title: 'Team',
		key: '4',
		dataIndex: ['employee', 'team', 'TeamName'],
		align: 'center',
		width: 130
	},
	{
		title: 'Start',
		key: '5',
		dataIndex: 'start_date',
		align: 'center',
		width: 120,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={
							!row.received_date ||
							row.disableHistory ||
							row.assessment_id !== 1 ||
							checkIfOwner(row)
						}
						onClick={() => handleActionStatus(row, 'start_date')}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</>
			)
	},

	{
		title: 'Pending',
		key: '6',
		dataIndex: 'pending',
		align: 'center',
		width: 70,
		render: (text, row) => (
			<Tooltip placement="top" title={'Assess Pending'}>
				<Button
					type="primary"
					// disabled={
					// 	!row.received_date ||
					// 	!row.start_date ||
					// 	row.finished_date ||
					// 	row.disableHistory
					// }
					onClick={() => handleActionPending(row)}
					shape="circle"
					icon={<ClockCircleOutlined />}
				/>
			</Tooltip>
		)
	},
	{
		title: 'Finish',
		key: '7',
		dataIndex: 'finished_date',
		align: 'center',

		width: 120,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={
							!row.start_date ||
							!row.received_date ||
							pendingItems.some((item) => !item.start || !item.resume) ||
							row.disableHistory ||
							checkIfOwner(row)
						}
						onClick={() => handleActionStatus(row, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</>
			)
	},

	{
		title: 'Duration',
		key: '8',
		dataIndex: 'days_in_process',
		align: 'center',
		width: 70
	},
	{
		title: 'Henkou Details',
		key: '9',
		dataIndex: 'log',
		align: 'center',
		width: 150,
		render: (text, row) => {
			return (
				<TextArea
					value={text}
					disabled={
						row.resume && row.start
							? true
							: false || row.disableHistory || checkIfOwner(row)
					}
					bordered={false}
					onChange={(value) => handleActionDetails(row, value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
			);
		}
	}
];
export default ActionHeaders;
