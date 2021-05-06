import React from 'react';
import { Button, Select, Input, AutoComplete } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

const { TextArea } = Input;

const PendingHeaders = (handleStatus, handleReasonInput, userInfo, options) => [
	{
		title: 'No.',
		dataIndex: 'pending_index',
		key: '1',
		width: 70,
		align: 'center',
		fixed: 'left'
	},
	{
		title: 'Revision No.',
		dataIndex: 'rev_no',
		key: '2',
		align: 'center',
		width: 120,
		fixed: 'left'
	},
	{
		title: 'Start',
		key: '3',
		dataIndex: 'start',
		align: 'center',
		width: 150,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						onClick={() => handleStatus(row, 'start', true)}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</>
			)
	},
	{
		title: 'Reason',
		key: '4',
		dataIndex: 'reason',
		align: 'center',
		render: (text, row) => (
			<AutoComplete
				value={text}
				disabled={row.resume || !row.start}
				options={options.data}
				style={{
					width: 110
				}}
				onFocus={(value) => options.onFocus(value, 'reason', row)}
				onSelect={(value) => options.onSelect(value, 'reason', row)}>
				<TextArea
					value={text}
					bordered={false}
					disabled={row.resume || !row.start}
					onChange={(value) => handleReasonInput(row, 'reason', value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
			</AutoComplete>
		),
		width: 150
	},
	{
		title: 'Borrow Details',
		key: '4',
		dataIndex: 'borrow_details',
		align: 'center',
		render: (text, row) => {
			console.log(row);
			return (
				<TextArea
					value={text}
					bordered={false}
					disabled={
						row.resume ||
						!row.start ||
						(row.reason.match(/borrow form/gi) ? false : true)
					}
					onChange={(value) => handleReasonInput(row, 'borrow_details', value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
			);
		},
		width: 150
	},
	{
		title: 'Resume',
		key: '5',
		dataIndex: 'resume',
		align: 'center',
		width: 150,
		render: (text, row, index) =>
			text ? (
				<b>{text}</b>
			) : (
				<>
					<Button
						type="primary"
						disabled={!row.start || row.updated_by !== userInfo.EmployeeCode}
						onClick={() => handleStatus(row, 'resume', true)}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</>
			)
	},
	{
		title: 'Duration',
		key: '6',
		dataIndex: 'duration',
		align: 'center',
		width: 70
	},
	{
		title: 'Remarks',
		key: '4',
		dataIndex: 'remarks',
		align: 'center',
		render: (text, row) => (
			<TextArea
				value={text}
				bordered={false}
				disabled={row.resume || !row.start}
				onChange={(value) => handleReasonInput(row, 'remarks', value)}
				autoSize={{ minRows: 1, maxRows: 4 }}
			/>
		),
		width: 150
	}
];
export default PendingHeaders;
