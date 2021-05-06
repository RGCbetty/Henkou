import React, { useState, useEffect } from 'react';
import { Button, Select, Tag, Tooltip, Input, AutoComplete } from 'antd';
import Http from '../../Http';
import {
	PlayCircleOutlined,
	PauseCircleOutlined,
	FieldTimeOutlined,
	ClockCircleOutlined
} from '@ant-design/icons';
const { Option } = Select;
const { TextArea } = Input;
// const FinishCol = ({ text, row, actions, status, pendingItems }) => {
// 	const [pending, setPending] = useState([]);
// 	useEffect(() => {
// 		let mounted = true;
// 		(async () => {
// 			try {
// 				const response = await Http.get(
// 					`/api/pending/detail_id/${row.detail_id}/affected_id/${row.affected_id}`
// 				);
// 				const { data } = response;
// 				if (mounted) {
// 					setPending(data);
// 				}
// 			} catch (error) {
// 				if (Http.isCancel(error)) {
// 					console.error(error);
// 				} else {
// 					throw error;
// 				}
// 			}
// 		})();
// 		return () => {
// 			mounted = false;
// 		};
// 	}, [pendingItems]);
// 	return (
// 		<Button
// 			type="primary"
// 			disabled={
// 				!row.start_date ||
// 				!row.received_date ||
// 				row.assessment_id !== 1 ||
// 				// !status[
// 				// 	status.findIndex((el) => el.sequence == row.sequence) == 0
// 				// 		? status.findIndex((el) => el.sequence == row.sequence)
// 				// 		: status.findIndex((el) => el.sequence == row.sequence) - 1
// 				// ].start_date ||
// 				pending.some((item) => !item.resume_date) ||
// 				(status.findIndex((el) => el.sequence == row.sequence) == 0
// 					? !status[status.findIndex((el) => el.sequence == row.sequence)]
// 							.received_date &&
// 					  status[status.findIndex((el) => el.sequence == row.sequence)]
// 							.assessment_id !== 1
// 					: // !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
// 					// 		.received_date ||
// 					status[status.findIndex((el) => el.sequence == row.sequence) - 1]
// 							.assessment_id == 1
// 					? !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
// 							.finished_date
// 					: !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
// 							.assessment_id
// 					? true
// 					: !status[status.findIndex((el) => el.sequence == row.sequence)].received_date)
// 			}
// 			onClick={() => actions.handleEventStatus(null, 'finished_date', row)}
// 			shape="circle"
// 			icon={<PauseCircleOutlined />}
// 		/>
// 	);
// };
export const henkouStatusHeader = (assessment, actions, checkIfOwner, status, pendingItems) => [
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
		width: 130,
		fixed: 'left'
	},
	{
		title: 'Product / Process',
		key: '3',
		width: 300,
		dataIndex: 'product_name',
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

	{
		title: 'Department',
		dataIndex: 'department',
		key: '4',
		align: 'center',
		width: 150
	},
	// {
	// 	title: 'Section',
	// 	dataIndex: 'section',
	// 	key: '5',
	// 	align: 'center',
	// 	width: 170
	// },
	// {
	// 	title: 'Team',
	// 	dataIndex: 'team',
	// 	key: '6',
	// 	align: 'center',
	// 	width: 150
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
						row.assessment_id == 2 ||
						row.assessment_id == 3 ||
						checkIfOwner(row) ||
						(status.findIndex((el) => el.sequence == row.sequence) == 0
							? !status[status.findIndex((el) => el.sequence == row.sequence)]
									.received_date &&
							  status[status.findIndex((el) => el.sequence == row.sequence)]
									.assessment_id !== 1
							: //  !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
							// 		.received_date ||
							status[status.findIndex((el) => el.sequence == row.sequence) - 1]
									.assessment_id == 1
							? !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
									.finished_date
							: !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
									.assessment_id
							? true
							: !status[status.findIndex((el) => el.sequence == row.sequence)]
									.received_date)
					}
					onChange={(value) => actions.handleEventStatus(value, 'assessment_id', row)}
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
	// {
	// 	title: 'Pending',
	// 	key: '9',
	// 	dataIndex: 'pending',
	// 	align: 'center',
	// 	width: 70,
	// 	render: (text, row) => (
	// 		<Tooltip placement="top" title={'Assess Pending'}>
	// 			<Button
	// 				type="primary"
	// 				disabled={(row.toggleSelect, !row.received_date)}
	// 				onClick={() => actions.handlePending(row)}
	// 				shape="circle"
	// 				icon={<ClockCircleOutlined />}
	// 			/>
	// 		</Tooltip>
	// 	)
	// },

	{
		title: 'Action',
		key: '6',
		align: 'center',
		width: 50,
		dataIndex: 'action',
		render: (text, row) => (
			<Button
				type="primary"
				// disabled={
				// row.assessment_id !== 1 ||
				// !row.received_date ||
				// row.finished_date
				// ||
				// (status.findIndex((el) => el.sequence == row.sequence) == 0
				// 	? !status[status.findIndex((el) => el.sequence == row.sequence)]
				// 			.received_date ||
				// 	  status[status.findIndex((el) => el.sequence == row.sequence)]
				// 			.assessment_id !== 1
				// 	: !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
				// 			.received_date ||
				// 	  status[status.findIndex((el) => el.sequence == row.sequence) - 1]
				// 			.assessment_id == 1
				// 	? !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
				// 			.finished_date
				// 	: !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
				// 			.assessment_id
				// 	? true
				// 	: !status[status.findIndex((el) => el.sequence == row.sequence)]
				// 			.received_date)
				// }
				onClick={() => actions.handleAction(row)}
				shape="circle"
				icon={<FieldTimeOutlined />}
			/>
		)
	},
	// {
	// 	title: 'Start',
	// 	key: '7',
	// 	dataIndex: 'start_date',
	// 	align: 'center',
	// 	width: 150,
	// 	render: (text, row, index) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			<>
	// 				<Button
	// 					type="primary"
	// 					disabled={
	// 						row.assessment_id !== 1 ||
	// 						!row.received_date ||
	// 						(status.findIndex((el) => el.sequence == row.sequence) == 0
	// 							? !status[status.findIndex((el) => el.sequence == row.sequence)]
	// 									.received_date ||
	// 							  status[status.findIndex((el) => el.sequence == row.sequence)]
	// 									.assessment_id !== 1
	// 							: //  !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
	// 							// 		.received_date ||
	// 							status[status.findIndex((el) => el.sequence == row.sequence) - 1]
	// 									.assessment_id == 1
	// 							? !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
	// 									.finished_date
	// 							: !status[status.findIndex((el) => el.sequence == row.sequence) - 1]
	// 									.assessment_id
	// 							? true
	// 							: !status[status.findIndex((el) => el.sequence == row.sequence)]
	// 									.received_date)
	// 					}
	// 					// disabled={row.assessment_id !== 1}
	// 					onClick={() => actions.handleEventStatus(null, 'start_date', row)}
	// 					shape="circle"
	// 					icon={<PlayCircleOutlined />}
	// 				/>
	// 			</>
	// 		)
	// },
	// {
	// 	title: 'Henkou Details',
	// 	key: '8',
	// 	dataIndex: 'logs',
	// 	align: 'center',
	// 	width: 150,
	// 	render: (text, row) => (
	// 		<TextArea
	// 			value={text}
	// 			bordered={false}
	// 			disabled={
	// 				row.resume && row.start
	// 					? true
	// 					: false || row.finished_date || row.assessment_id !== 1
	// 			}
	// 			onChange={(value) => actions.handleEventStatus(value, 'log', row)}
	// 			autoSize={{ minRows: 1, maxRows: 4 }}
	// 		/>
	// 	)
	// },
	// {
	// 	title: 'Finish',
	// 	key: '9',
	// 	dataIndex: 'finished_date',
	// 	align: 'center',

	// 	width: 150,
	// 	render: (text, row, index) =>
	// 		text ? (
	// 			<b>{text}</b>
	// 		) : (
	// 			<>
	// 				<FinishCol
	// 					text={text}
	// 					row={row}
	// 					actions={actions}
	// 					status={status}
	// 					pendingItems={pendingItems}
	// 				/>
	// 				{/* <Button
	// 					type="primary"
	// 					disabled={
	// 						!row.start_date ||
	// 						!row.received_date ||
	// 						row.assessment_id !== 1 ||
	// 						!status[
	// 							status.findIndex((el) => el.sequence == row.sequence) == 0
	// 								? status.findIndex((el) => el.sequence == row.sequence)
	// 								: status.findIndex((el) => el.sequence == row.sequence) - 1
	// 						].start_date ||
	// 						checkPendingOngoing(row)
	// 					}
	// 					onClick={() => actions.handleEventStatus(null, 'finished_date', row)}
	// 					shape="circle"
	// 					icon={<PauseCircleOutlined />}
	// 				/>*/}
	// 			</>
	// 		)
	// },
	{
		title: 'Days in Process',
		key: '10',
		align: 'center',
		width: 100,
		dataIndex: 'days_in_process'
	}
];
