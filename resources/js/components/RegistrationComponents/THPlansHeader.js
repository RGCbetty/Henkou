import React, { useState, useEffect } from 'react';

/* Material Design */
import { Button, Tooltip, Input, Select } from 'antd';
import {
	PlayCircleOutlined,
	PauseCircleOutlined,
	HighlightOutlined,
	FilePdfTwoTone,
	CommentOutlined
} from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;
export const headers = (
	columnSearch,
	{ reason, THAction, THAssessment, PlanStatus },
	{
		handleClickPDF,
		handleSelectOption,
		handleOnClickEvent,
		handleInputText,
		handleRegistrationModal
	}
) => [
	{
		title: 'Received Date',
		width: 100,
		dataIndex: 'RequestAcceptedDate',
		key: '1',
		fixed: 'left',
		align: 'center'
	},
	{
		title: 'Customer Code',
		width: 140,
		dataIndex: 'ConstructionCode',
		key: '2',
		fixed: 'left',
		align: 'center',
		...columnSearch('ConstructionCode', 'Customer Code')
	},
	{
		title: 'House Code',
		width: 120,
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
		width: 120,
		key: '4'
	},
	{
		title: 'Plan No.',
		width: 80,
		dataIndex: 'PlanNo',
		align: 'center',
		key: '5'
	},
	{
		title: 'TH No.',
		width: 50,
		dataIndex: 'RequestNo',
		align: 'center',
		key: '6'
	},
	{
		title: 'TH View',
		dataIndex: 'thview',
		width: 50,
		align: 'center',
		key: '7',
		render: (text, record) => (
			// <Tooltip title={text}>
			<Button
				type="link"
				// icon={<PlayCircleOutlined />}
				onClick={() => handleClickPDF(event, record)}>
				PDF
				<FilePdfTwoTone />
			</Button>
			// </Tooltip>
		)
	},
	// {
	// 	title: 'Assessment',
	// 	width: 115,
	// 	dataIndex: 'th_assessment_id',
	// 	align: 'center',
	// 	key: '8',
	// 	render: (text, record) => {
	// 		return (
	// 			<Select
	// 				defaultValue=""
	// 				value={THAssessment.length > 0 ? text : null}
	// 				onChange={(value) => handleSelectOption(value, 'th_assessment_id', record)}
	// 				style={{ width: 180 }}>
	// 				{THAssessment.map((item, index) => {
	// 					return (
	// 						<Option key={item.id} value={item.id}>
	// 							{item.assessment_th_name}
	// 						</Option>
	// 					);
	// 				})}
	// 			</Select>
	// 		);
	// 	}
	// },
	// {
	// 	title: 'Reason',
	// 	width: 115,
	// 	dataIndex: 'reason_id',
	// 	align: 'center',
	// 	key: '9',
	// 	render: (text, record) => {
	// 		return (
	// 			<Select
	// 				defaultValue=""
	// 				value={text}
	// 				onChange={(value) => handleSelectOption(value, 'reason_id', record)}
	// 				style={{ width: 175 }}>
	// 				{reason.map((item, index) => {
	// 					return (
	// 						<Option key={item.id} value={item.id}>
	// 							{item.reason_name}
	// 						</Option>
	// 					);
	// 				})}
	// 			</Select>
	// 		);
	// 	}
	// },
	// {
	// 	title: 'Start',
	// 	width: 150,
	// 	dataIndex: 'start_date',
	// 	align: 'center',
	// 	key: '10',
	// 	render: (text, record) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			// <Tooltip title={text}>
	// 			<Button
	// 				type="primary"
	// 				onClick={() => handleOnClickEvent(record, 'start_date')}
	// 				shape="circle"
	// 				icon={<PlayCircleOutlined />}
	// 			/>
	// 			// </Tooltip>
	// 		)
	// },
	// {
	// 	title: 'Pending Start',
	// 	width: 150,
	// 	dataIndex: 'pending_start_date',
	// 	align: 'center',
	// 	key: '11',
	// 	render: (text, record) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			<Tooltip title={text}>
	// 				<Button
	// 					type="primary"
	// 					disabled={record.start_date}
	// 					onClick={() => handleOnClickEvent(record, 'pending_start_date')}
	// 					shape="circle"
	// 					icon={<PlayCircleOutlined />}
	// 				/>
	// 			</Tooltip>
	// 		)
	// },
	// {
	// 	title: 'Pending Reason',
	// 	width: 200,
	// 	dataIndex: 'th_action_id',
	// 	align: 'center',
	// 	key: '12',
	// 	render: (text, record) => {
	// 		return (
	// 			<Select
	// 				defaultValue=""
	// 				// disabled={
	// 				// 	!record.finished_date ||
	// 				// 	!record.th_assessment_id ||
	// 				// 	!record.reason_id ||
	// 				// 	!record.remarks
	// 				// }
	// 				value={text}
	// 				onChange={(value) => handleSelectOption(value, 'th_action_id', record)}
	// 				style={{ width: 170 }}>
	// 				{THAction.map((item) => {
	// 					return (
	// 						<Option key={item.id} value={item.id}>
	// 							{item.action_name}
	// 						</Option>
	// 					);
	// 				})}
	// 			</Select>
	// 		);
	// 	}
	// },
	// {
	// 	title: 'Pending Resume',
	// 	width: 150,
	// 	dataIndex: 'pending_resume_date',
	// 	align: 'center',
	// 	key: '13',
	// 	render: (text, record) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			<Tooltip title={text}>
	// 				<Button
	// 					type="primary"
	// 					disabled={!record.pending_start_date}
	// 					onClick={() => handleOnClickEvent(record, 'pending_resume_date')}
	// 					shape="circle"
	// 					icon={<PauseCircleOutlined />}
	// 				/>
	// 			</Tooltip>
	// 		)
	// },
	{
		title: 'Plan Status',
		width: 200,
		dataIndex: 'plan_status',
		filters: PlanStatus.map((item) => ({
			text: item.plan_status_name,
			value: item.id
		})),
		onFilter: (value, record) => (record.plan_status ? record.plan_status.id == value : null),
		render: (text, record) => (text ? text.plan_status_name : null),
		align: 'center',
		key: '14'
	},
	// {
	// 	title: 'Details',
	// 	width: 115,
	// 	dataIndex: 'logs',
	// 	render: (text, record) => (
	// 		<TextArea
	// 			value={text}
	// 			bordered={false}
	// 			onChange={(value) => handleInputText(value, 'logs', record)}
	// 			autoSize={{ minRows: 1, maxRows: 4 }}
	// 		/>
	// 	),
	// 	align: 'center',
	// 	key: '15'
	// },

	// {
	// 	title: 'Finish',
	// 	width: 150,
	// 	dataIndex: 'finished_date',
	// 	align: 'center',
	// 	key: '16',
	// 	render: (text, record) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			<Tooltip title={text}>
	// 				<Button
	// 					type="primary"
	// 					disabled={!record.start_date}
	// 					onClick={() => handleOnClickEvent(record, 'finished_date')}
	// 					shape="circle"
	// 					icon={<PauseCircleOutlined />}
	// 				/>
	// 			</Tooltip>
	// 		)
	// },
	{
		title: 'Start (Remake)',
		dataIndex: 'ResumedProcessingDate',
		width: 100,
		align: 'center',
		key: '17'
	},
	{
		title: 'Register',
		fixed: 'right',
		width: 80,
		align: 'center',
		key: '18',
		render: (text, record) => (
			<Button
				type="primary"
				onClick={() => handleRegistrationModal(record)}
				shape="circle"
				icon={<HighlightOutlined />}
			/>
		)
	}
];
export const modalHeader = (
	columnSearch,
	{ reason, THAction, THAssessment, PlanStatus },
	{
		handleClickPDF,
		handleSelectOption,
		handleOnClickEvent,
		handleInputText,
		handleRegistrationModal
	}
) => [
	{
		title: 'Assessment',
		width: 100,
		dataIndex: 'th_assessment_id',
		align: 'center',
		key: '8',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					value={THAssessment.length > 0 ? text : null}
					onChange={(value) => handleSelectOption(value, 'th_assessment_id', record)}
					style={{ width: 180 }}>
					{THAssessment.map((item, index) => {
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
		width: 100,
		dataIndex: 'reason_id',
		align: 'center',
		key: '9',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					value={text}
					onChange={(value) => handleSelectOption(value, 'reason_id', record)}
					style={{ width: 175 }}>
					{reason.map((item, index) => {
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
		dataIndex: 'start_date',
		width: 100,
		align: 'center',
		key: '10',
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
		title: 'Pending Reason',
		width: 120,
		dataIndex: 'th_action_id',
		align: 'center',
		key: '12',
		render: (text, record) => {
			return (
				<Select
					defaultValue=""
					disabled={!record.start_date}
					// disabled={
					// 	!record.finished_date ||
					// 	!record.th_assessment_id ||
					// 	!record.reason_id ||
					// 	!record.remarks
					// }
					value={text}
					onChange={(value) => handleSelectOption(value, 'th_action_id', record)}
					style={{ width: 170 }}>
					{THAction.map((item) => {
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
		title: 'Pending Start',
		dataIndex: 'pending_start_date',
		width: 100,
		align: 'center',
		key: '11',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				<Tooltip title={text}>
					<Button
						type="primary"
						disabled={!record.th_action_id}
						onClick={() => handleOnClickEvent(record, 'pending_start_date')}
						shape="circle"
						icon={<PlayCircleOutlined />}
					/>
				</Tooltip>
			)
	},
	{
		title: 'Pending Resume',
		dataIndex: 'pending_resume_date',
		width: 100,
		align: 'center',
		key: '13',
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
		title: 'Details',
		width: 180,
		dataIndex: 'logs',
		render: (text, record) => (
			<TextArea
				value={text}
				disabled={!record.start_date}
				bordered={false}
				onChange={(value) => handleInputText(value, 'logs', record)}
				autoSize={{ minRows: 1, maxRows: 4 }}
			/>
		),
		align: 'center',
		key: '15'
	},
	{
		title: 'Finish',
		dataIndex: 'finished_date',
		width: 100,
		align: 'center',
		key: '16',
		render: (text, record) =>
			text ? (
				<b>{text}</b>
			) : (
				<Tooltip title={text}>
					<Button
						type="primary"
						disabled={!record.start_date || !record.logs}
						onClick={() => handleOnClickEvent(record, 'finished_date')}
						shape="circle"
						icon={<PauseCircleOutlined />}
					/>
				</Tooltip>
			)
	}
];
