import React, { useState, useEffect } from 'react';

/* Material Design */
import { Button, Tooltip, Input, Select } from 'antd';
import {
	PlayCircleOutlined,
	PauseCircleOutlined,
	EyeOutlined,
	FilePdfTwoTone,
	CommentOutlined
} from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;
export const headers = (
	columnSearch,
	{ reasons, thActions, thAssessments, fetching },
	handleClickPDF,
	handleSelectOption,
	handleOnClickEvent,
	handleInputText
) => [
	{
		title: 'Received Date',
		width: 130,
		dataIndex: 'RequestAcceptedDate',
		key: '1',
		fixed: 'left',
		align: 'center'
	},
	{
		title: 'Customer Code',
		width: 150,
		dataIndex: 'ConstructionCode',
		key: '2',
		fixed: 'left',
		align: 'center',
		...columnSearch('ConstructionCode', 'Customer Code')
	},
	{
		title: 'House Code',
		width: 150,
		dataIndex: 'NameCode',
		key: '3',
		fixed: 'left',
		align: 'center',
		...columnSearch('NameCode', 'House Code')
	},
	{
		title: 'House Type',
		dataIndex: 'ConstructionTypeName',
		align: 'center',
		width: 150,
		key: '4'
	},
	{
		title: 'Plan Number',
		width: 120,
		dataIndex: 'PlanNo',
		align: 'center',
		key: '5'
	},
	{
		title: 'TH Number',
		width: 115,
		dataIndex: 'RequestNo',
		align: 'center',
		key: '6'
	},
	{
		title: 'TH View',
		dataIndex: 'thview',
		align: 'center',
		key: '7',
		render: (text, record) => (
			// <Tooltip title={text}>
			<Button
				type="link"
				// icon={<PlayCircleOutlined />}
				onClick={() => handleClickPDF(event, record)}>
				View PDF
				<FilePdfTwoTone />
			</Button>
			// </Tooltip>
		)
	},
	{
		title: 'Assessment',
		width: 115,
		dataIndex: 'th_assessment_id',
		align: 'center',
		key: '8',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					disabled={fetching}
					value={thAssessments.length > 0 ? text : null}
					onChange={(value) => handleSelectOption(value, 'th_assessment_id', record)}
					style={{ width: 180 }}>
					{thAssessments.map((item, index) => {
						return (
							<Option key={item.id} value={item.id}>
								{item.assessment_th_name}
							</Option>
						);
					})}
				</Select>
			);
		}
	},
	{
		title: 'Reason',
		width: 115,
		dataIndex: 'reason_id',
		align: 'center',
		key: '11',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					value={text}
					onChange={(value) => handleSelectOption(value, 'reason_id', record)}
					disabled={fetching}
					style={{ width: 175 }}>
					{reasons.map((item, index) => {
						return (
							<Option key={item.id} value={item.id}>
								{item.reason_name}
							</Option>
						);
					})}
				</Select>
			);
		}
	},
	{
		title: 'Start',
		width: 150,
		dataIndex: 'start_date',
		align: 'center',
		key: '9',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				// <Tooltip title={text}>
				<Button
					type="primary"
					onClick={() => handleOnClickEvent(record, 'start_date')}
					shape="circle"
					icon={<PlayCircleOutlined />}
				/>
				// </Tooltip>
			)
	},
	{
		title: 'Pending Start',
		width: 150,
		dataIndex: 'pending_start_date',
		align: 'center',
		key: '10',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				<Tooltip title={text}>
					<Button
						type="primary"
						disabled={record.start_date}
						onClick={() => handleOnClickEvent(record, 'pending_start_date')}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</Tooltip>
			)
	},
	{
		title: 'Pending Reason',
		width: 200,
		dataIndex: 'th_action_id',
		align: 'center',
		key: '11',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					// disabled={
					// 	!record.finished_date ||
					// 	!record.th_assessment_id ||
					// 	!record.reason_id ||
					// 	!record.remarks
					// }
					value={text}
					onChange={(value) => handleSelectOption(value, 'th_action_id', record)}
					style={{ width: 170 }}>
					{thActions.map((item) => {
						return (
							<Option key={item.id} value={item.id}>
								{item.action_name}
							</Option>
						);
					})}
				</Select>
			);
		}
	},
	{
		title: 'Pending Resume',
		width: 150,
		dataIndex: 'pending_resume_date',
		align: 'center',
		key: '12',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				<Tooltip title={text}>
					<Button
						type="primary"
						disabled={!record.pending_start_date}
						onClick={() => handleOnClickEvent(record, 'pending_resume_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</Tooltip>
			)
	},
	{
		title: 'Plan Status',
		width: 200,
		dataIndex: 'plan_status',
		filters: [
			{
				text: 'E-PLAN PROCESS',
				value: 1
			},
			{
				text: 'KOUZOU FINISHED-WAKU',
				value: 2
			},
			{
				text: 'ONE TIME HENKOU',
				value: 3
			},
			{
				text: 'KOUZOU FINISHED-JIKU',
				value: 4
			}
		],
		onFilter: (value, record) => (record.plan_status ? record.plan_status.id == value : null),
		render: (text, record) => (text ? text.plan_status_name : null),
		align: 'center',
		key: '13'
	},
	{
		title: 'Details',
		width: 115,
		dataIndex: 'logs',
		render: (text, record) => (
			<TextArea
				value={text}
				bordered={false}
				onChange={(value) => handleInputText(value, 'logs', record)}
				autoSize={{ minRows: 1, maxRows: 4 }}
			/>
		),
		align: 'center',
		key: '17'
	},

	{
		title: 'Finish',
		width: 150,
		dataIndex: 'finished_date',
		align: 'center',
		key: '14',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				<Tooltip title={text}>
					<Button
						type="primary"
						disabled={!record.start_date}
						onClick={() => handleOnClickEvent(record, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</Tooltip>
			)
	},
	{
		title: 'Start (Remake)',
		width: 130,
		dataIndex: 'ResumedProcessingDate',
		align: 'center',
		key: '16'
	}
];
