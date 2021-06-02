import React from 'react';
import { Button, Select, Input, Tooltip, AutoComplete } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import durationAsString from '../../utils/diffDate';
import moment from 'moment';

const { Option } = Select;

const { TextArea } = Input;

const ActionHeaders = (
	handleOnClickProcessTime,
	handleProcessDetails,
	showPendingModal,
	checkIfOwner,
	pendingItems
) => [
	{
		title: 'No.',
		key: '1',
		width: 30,
		align: 'center',
		render: (_, row, index) => index + 1
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
							!row.received_date || row.assessment_id !== 1 || checkIfOwner(row)
						}
						onClick={() => handleOnClickProcessTime(row, 'start_date')}
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
					onClick={() => showPendingModal(row)}
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
							pendingItems?.some((item) => item.start && !item.resume) ||
							// row.disableHistory ||
							checkIfOwner(row)
						}
						onClick={() => handleOnClickProcessTime(row, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</>
			)
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
		title: 'Henkou Details',
		key: '9',
		dataIndex: 'log',
		align: 'center',
		width: 150,
		render: (text, row) => {
			return (
				<TextArea
					value={text}
					disabled={row.resume && row.start ? true : false || checkIfOwner(row)}
					bordered={false}
					onChange={(value) => handleProcessDetails(row, value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
			);
		}
	}
];
export default ActionHeaders;
