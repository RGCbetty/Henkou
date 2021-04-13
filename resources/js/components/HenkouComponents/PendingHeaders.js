import React from 'react';
import { Button, Select, Input, AutoComplete } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

const { TextArea } = Input;

const PendingHeaders = (handleStatus, handleReasonInput, options) => [
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
					width: 200
				}}
				onFocus={(value) => options.onFocus(value, 'reason', row)}
				onSelect={(value) => options.onSelect(value, 'reason', row)}>
				<TextArea
					value={text}
					bordered={false}
					disabled={row.resume || !row.start}
					onChange={(value) => handleReasonInput(row, value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
			</AutoComplete>
		),
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
						disabled={!row.start}
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
	}
];
export default PendingHeaders;
