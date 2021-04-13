/* Utilities */
import React, { useState } from 'react';
import moment from 'moment';
import Http from '../../Http';
import { connect } from 'react-redux';

/* Material Design */
import { Form, Row, Col, Input, Typography, notification, Modal, Table, Button, List } from 'antd';
import { DownOutlined, UpOutlined, PaperClipOutlined } from '@ant-design/icons';
/* Component */
import { henkouStatusHeader } from '../HenkouComponents/HenkouStatusHeader';
import { PlanCustomerInformation } from './PlanCustomerInformation';
import PendingHeaders from '../HenkouComponents/PendingHeaders';
import Legend from '../Legend';
import ActionHeaders from './ActionHeaders';
import { uniqBy } from 'lodash';

import { completeDetailsStatus } from '../../api/status';

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const HenkouContainer = (props) => {
	const { details, handleEvent, handleUpdate, assessment, status, master, logs, ...rest } = props;
	const [showCollapse, setShowCollapse] = useState(false);
	const [expand, setExpand] = useState(false);
	const [row, setRow] = useState({});
	const [isVisible, setVisibilty] = useState({
		attachmentModal: false,
		pendingModal: false,
		actionModal: false
	});
	const [attachments, setAttachments] = useState([]);
	const [pendingItems, setPendingItems] = useState([]);
	const [actionItems, setActionItems] = useState([]);

	const [options, setOptions] = useState([]);
	const [form] = Form.useForm();
	/* HENKOU PROCESS */
	// const uniqueProducts = _.uniqBy(concatenatedProducts, (obj) => obj.product_key);
	const checkIfOwner = (record) => {
		if (
			record.department == rest.userInfo.DepartmentName &&
			record.section == rest.userInfo.SectionName &&
			record.team == rest.userInfo.TeamName
		) {
			return false;
		} else {
			return true;
		}
	};
	// const checkIfSupplier = (record) => {
	// 	if (
	// 		record.department == rest.userInfo.DepartmentName &&
	// 		record.section == rest.userInfo.SectionName &&
	// 		record.team == rest.userInfo.TeamName
	// 	) {
	// 		if (
	// 			suppliers.length > 0
	// 				? suppliers.find(
	// 						(item) => item.product_key == record.product_key && item.last_touch
	// 				  )
	// 					? suppliers.find((item) => item.product_key == record.product_key)
	// 							.last_touch
	// 					: false
	// 				: false
	// 		) {
	// 			return false;
	// 		} else {
	// 			return true;
	// 		}
	// 	} else {
	// 		return true;
	// 	}
	// };

	const handleActionStatus = (record, key, isPendingItems = null) => {
		record[key] = moment().format('YYYY-MM-DD HH:mm:ss');
		if (isPendingItems) {
			if (key == 'start') {
				record.isItemStarted = true;
			}
			if (key == 'resume') {
				// const diff_seconds = moment(row.start).diff(row.resume, 'seconds');
				// const ms = moment(row.resume, 'YYYY-MM-DD HH:mm:ss').diff(
				// 	moment(row.start, 'YYYY-MM-DD HH:mm:ss')
				// );
				// const d = moment.duration(ms);
				record.resume_date = row[key];
				record.duration = isNaN(moment(record.start).diff(record.resume))
					? ''
					: durationAsString(record.start, record.resume);
				setRow({ ...row });
				// row.pending_id = row.pending_id + 1;
			}
			pendingItems[
				pendingItems.findIndex((item) => item.pending_index == record.pending_index)
			] = record;
			const clonePendingItems = [...pendingItems];
			setPendingItems(clonePendingItems);
		} else {
			if (key == 'finished_date') {
				// row.received_date = moment().format('YYYY-MM-DD HH:mm:ss');
				record.days_in_process = isNaN(moment(record.start_date).diff(record.finished_date))
					? ''
					: durationAsString(record.start_date, record.finished_date);
				// setRow({ ...row });
			}
			actionItems[
				actionItems.findIndex((item) => item.status_index == record.status_index)
			] = record;
			const cloneActionItems = [...actionItems];
			setActionItems(cloneActionItems);
		}
	};
	const handleAssessment = (value, key, record) => {
		record[key] = value;
		// if (value !== 3) {
		// 	record.toggleSelect = false;
		// } else {
		// 	record.toggleSelect = true;
		// }
		handleUpdate(details, record, key);
		// handleUpdate;
	};
	const handleEventStatus = (e, key, record) => {
		if (key == 'assessment_id') {
			record[key] = e;
		} else if (key == 'log') {
			record[key] = e.target.value;
		} else if (key == 'start_date' || key == 'finished_date') {
			record[key] = moment().format('YYYY-MM-DD HH:mm:ss');
		}
		handleUpdate(details, record, key);
	};

	/* HENKOU PROCESS */

	/*  */
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};
	const openNotificationWithIcon = (type) => {
		notification[type]({
			message: 'Plan not yet registered!'
		});
	};
	const onEnter = async (e) => {
		const result = await handleEvent(e.target.value);
		result == 'found'
			? (setExpand(true), setShowCollapse(true))
			: (setExpand(false), openNotificationWithIcon('info'));
	};
	/*  */
	/* PENDING MODAL */
	const handleActionPending = async (record) => {
		const pendingResource = await Http.get(
			`/api/pending/detail_id/${record.detail_id}/affected_id/${record.affected_id}`
		);
		if (pendingResource.data.length == 0) {
			if (pendingItems.length == 0) {
				// setPendingItems([]);

				let pending = [];
				for (let i = 0; i < 1; i++) {
					pending.push({
						pending_id: null,
						pending_index: i + 1,
						rev_no: details.rev_no,
						start: '',
						reason: '',
						resume: '',
						duration: '',
						product_key: record.ProductCode,
						...record
					});
				}
				setPendingItems(pending);
			}
		} else if (pendingItems.length == 0) {
			setPendingItems(
				pendingResource.data.map((item, index) => {
					return {
						pending_id: item.id,
						pending_index: index + 1,
						start: item.start_date,
						resume: item.resume_date,
						...item,
						id: item.status_id
					};
				})
			);
		}
		setRow({ ...row });

		setVisibilty({ ...isVisible, pendingModal: true });
	};

	const handlePendingOk = async () => {
		setVisibilty({ ...isVisible, pendingModal: false });
		// setPendingItems([]);
		// setRow({ ...row, disableFinish: false });
		// setRow({});
	};

	const handlePendingCancel = () => {
		setVisibilty({ ...isVisible, pendingModal: false });
		const filterPendingItems = pendingItems.filter((item) => item.pending_id);
		setPendingItems(filterPendingItems);
		// setRow({});
	};

	const addPendingItems = (record, key) => {
		function getMaxPendingID() {
			return pendingItems.reduce(
				(max, obj) => (obj.pending_index > max ? obj.pending_index : max),
				pendingItems[0].pending_index
			);
		}
		pendingItems.push({
			pending_id: null,
			pending_index: getMaxPendingID() + 1,
			rev_no: details.rev_no,
			start: '',
			reason: '',
			resume: '',
			duration: '',
			product_key: record.ProductCode,
			...record
		});
		let cloneItems = [...pendingItems];
		setPendingItems(cloneItems);
	};
	const handleActionDetails = (record, e) => {
		record.log = e.target.value;
		actionItems[
			actionItems.findIndex((item) => item.status_index == record.status_index)
		] = record;
		const cloneActionItems = [...actionItems];
		setActionItems(cloneActionItems);
	};
	const handleReasonInput = (record, e) => {
		record.reason = e.target.value;
		pendingItems[
			pendingItems.findIndex((item) => item.pending_index == record.pending_index)
		] = record;
		const clonePendingItems = [...pendingItems];
		setPendingItems(clonePendingItems);
	};
	/* PENDING MODAL */
	/* ATTACHMENT MODAL */
	const attachmentModalOk = () => {
		setVisibilty({ ...isVisible, attachmentModal: false });
	};
	const attachmentModalCancel = () => {
		setVisibilty({ ...isVisible, attachmentModal: false });
	};
	const handleAttachmentModal = async () => {
		const responseLists = await Http.get(`/api/henkou/attachments/${details.id}`);
		setAttachments(responseLists.data);
		setVisibilty({ ...isVisible, attachmentModal: true });
	};
	/* ATTACHMENT MODAL */
	/* ACTION MODAL */
	const handleAction = async (record) => {
		const pendingResource = await Http.get(
			`/api/pending/detail_id/${record.detail_id}/affected_id/${record.affected_id}`
		);
		setPendingItems(
			pendingResource.data.map((item, index) => {
				return {
					pending_id: item.id,
					pending_index: index + 1,
					start: item.start_date,
					resume: item.resume_date,
					...item,
					id: item.status_id
				};
			})
		);
		setActionItems(
			await completeDetailsStatus(
				record,
				master.affectedProducts,
				master.products,
				master,
				details
			)
		);
		setRow(record);
		setVisibilty({ ...isVisible, actionModal: true });
	};
	pendingItems;

	const handleActionOk = async () => {
		function getMaxActionID() {
			return actionItems.reduce(
				(max, obj) => (obj.status_index > max ? obj.status_index : max),
				actionItems[0].status_index
			);
		}
		// if (actionItems[getMaxActionID() - 1].log) {
		// handleUpdate(details);
		// } else {
		handleUpdate(details, actionItems[getMaxActionID() - 1], null, pendingItems);
		// }
		const filteredPendingItems = pendingItems.filter((item) => {
			return item.start || item.resume || item.reason;
		});
		if (filteredPendingItems.length > 0) {
			const response = await Http.post('/api/henkou/pending', filteredPendingItems);
		}

		// const filteredPendingItems = pendingItems.filter((item) => {
		// 	return item.start || item.resume || item.reason;
		// });
		// if (filteredPendingItems.length > 0) {
		// 	const response = await Http.post('/api/henkou/pending', filteredPendingItems);
		// }
		setVisibilty({ ...isVisible, actionModal: false });
		setPendingItems([]);
		setRow({});
	};

	const handleActionCancel = () => {
		setVisibilty({ ...isVisible, actionModal: false });
		setPendingItems([]);
		setRow({});
	};

	// const filteredStatus = (status) => {
	// 	const filterStatus = status.filter((item) => item.product_name == row.product_name);
	// 	const statusWithProductKey = filterStatus.map((item, index) => {
	// 		return {
	// 			status_index: index + 1,
	// 			...item,
	// 			logs: item.log ? item.log : item.logs,
	// 			days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
	// 				? ''
	// 				: durationAsString(item.start_date, item.finished_date),
	// 			product_key: affectedProducts.find((el) => el.id == item.affected_id)
	// 				? product
	// 					? product.find(
	// 							(el) =>
	// 								el.id ==
	// 								affectedProducts.find((el) => el.id == item.affected_id)
	// 									.product_category_id
	// 					  ).product_key
	// 					: null
	// 				: null
	// 		};
	// 	});
	// 	const uniqueStatusByProductKey = _.uniqBy(statusWithProductKey, (obj) => obj.product_name);
	// 	return uniqueStatusByProductKey;
	// };

	/* ACTION MODAL */
	const durationAsString = (start, end) => {
		const duration = moment.duration(moment(end).diff(moment(start)));

		//Get Days
		const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
		const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all

		//Get Hours
		const hours = duration.hours();
		const hoursFormatted = hours ? `${hours}h ` : '';

		//Get Minutes
		const minutes = duration.minutes();
		const minutesFormatted = minutes ? `${minutes}m ` : '';

		const seconds = duration.seconds();
		const secondsFormatted = `${seconds}s`;

		return [daysFormatted, hoursFormatted, minutesFormatted, secondsFormatted].join('');
	};
	const onFocus = (value) => {
		setOptions(
			!value
				? []
				: [
						{
							value: 'Borrow Form'
						}
				  ]
		);
	};
	const onSelect = (value, key, record) => {
		record[key] = value;
		// console.log(value, key, record, 'Onselect');
		pendingItems[
			pendingItems.findIndex((item) => item.pending_index == record.pending_index)
		] = record;
		const clonePendingItems = [...pendingItems];
		setPendingItems(clonePendingItems);
	};

	const checkPendingOngoing = (record) => {
		Http.get(
			`/api/pending/detail_id/${record.detail_id}/affected_id/${record.affected_id}`
		).then((res) => setPendingItems(res.data));
	};
	return (
		<>
			<Form
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={onFinish}>
				<Row gutter={[10, 10]}>
					<Col span={8}>
						<Search
							placeholder="Enter Code"
							allowClear
							addonBefore="Customer Code"
							onPressEnter={onEnter}
							style={{ width: 300, margin: '0 0' }}></Search>
					</Col>

					<Col offset={8} span={8} style={{ textAlign: 'right' }}>
						{expand ? (
							<Input
								addonBefore="Registration Date"
								value={
									details
										? moment(details.created_at).format('YYYY-MM-DD HH:mm:ss')
										: ''
								}
								style={{ width: 300 }}
							/>
						) : (
							''
						)}
					</Col>

					{expand ? (
						PlanCustomerInformation(details).map((item, index) => (
							<Col style={{ textAlign: item.textAlign }} span={6} key={index}>
								<Form.Item
									style={{ marginBottom: '0px' }}
									rules={[
										{
											required: true,
											message: 'Input something!'
										}
									]}>
									{item.title == 'View Attachments' ? (
										<Button
											onClick={handleAttachmentModal}
											icon={<PaperClipOutlined />}
											style={{ width: item.width }}>
											{item.title}
										</Button>
									) : (
										<Input
											addonBefore={item.title}
											value={item.value}
											style={{ width: item.width }}
										/>
									)}
								</Form.Item>
							</Col>
						))
					) : (
						<></>
					)}
				</Row>
				<Row>
					<Col span={24}>
						{expand ? (
							<>
								<span>Summary(Henkou Details)</span>
								<TextArea
									placeholder="Summary(Henkou Details)"
									autoSize
									value={
										logs.length > 0
											? logs
													.filter((item) => item.log)
													.map((stat, index) => {
														if (stat.log) {
															if (index == 0) {
																return `${moment
																	.utc(stat.updated_at)
																	.format(
																		'YYYY-MM-DD, h:mm:ss a'
																	) +
																	':  ' +
																	stat.log}`;
															} else {
																return (
																	'\n' +
																	moment
																		.utc(stat.updated_at)
																		.format(
																			'YYYY-MM-DD, h:mm:ss a'
																		) +
																	':  ' +
																	stat.log
																);
															}
														}
													})
													.join('')
											: ''
									}
									rows={5}></TextArea>
							</>
						) : (
							<></>
						)}
					</Col>

					{showCollapse ? (
						<Col span={24} style={{ textAlign: 'right' }}>
							<a
								style={{ fontSize: 12 }}
								onClick={() => {
									setExpand(!expand);
								}}>
								{expand ? <UpOutlined /> : <DownOutlined />} Collapse
							</a>
						</Col>
					) : null}
				</Row>
			</Form>
			<Modal
				title="Attachments"
				onOk={attachmentModalOk}
				onCancel={attachmentModalCancel}
				bodyStyle={{ padding: 0 }}
				visible={isVisible.attachmentModal}>
				<List
					size="small"
					bordered
					dataSource={attachments}
					renderItem={(item) => (
						<List.Item>
							<a onClick={() => window.open(`/storage/${item.path}`, '_blank')}>
								{item.name}
							</a>
						</List.Item>
					)}
				/>
			</Modal>
			<Modal
				title={`Pending ${row.product_name}`}
				onOk={handlePendingOk}
				okText="Save"
				onCancel={handlePendingCancel}
				bodyStyle={{ padding: 10 }}
				width={650}
				visible={isVisible.pendingModal}>
				{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
				<Table
					rowKey={(record) => record.pending_index}
					columns={PendingHeaders(handleActionStatus, handleReasonInput, {
						data: options,
						onFocus,
						onSelect
					})}
					dataSource={pendingItems}
					pagination={false}
					bordered
				/>
				<div style={{ textAlign: 'right' }}>
					<Button
						style={{ margin: 10 }}
						type="primary"
						disabled={pendingItems.some((item) => {
							return !item.resume;
						})}
						onClick={() => addPendingItems(row, 'finished_date')}>
						Add
					</Button>
				</div>
			</Modal>
			<Modal
				title={`${row.product_name}`}
				onOk={handleActionOk}
				okText="Save"
				onCancel={handleActionCancel}
				bodyStyle={{ padding: 10 }}
				width={1000}
				visible={isVisible.actionModal}>
				{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
				<Table
					rowKey={(record) => record.status_index}
					columns={ActionHeaders(
						handleActionStatus,
						handleActionDetails,
						handleActionPending,

						pendingItems
					)}
					dataSource={actionItems}
					pagination={false}
					bordered
				/>
				{/* <div style={{ textAlign: 'right' }}>
					<Button
						style={{ margin: 10 }}
						type="primary"
						disabled={pendingItems.some((item) => {
							return !item.resume;
						})}
						onClick={() => addPendingItems(row, 'finished_date')}>
						Add
					</Button>
				</div> */}
			</Modal>
			{expand ? (
				<div style={{ padding: 5 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Title
							level={4}
							style={{ margin: 0, display: 'inline-block', verticalAlign: 'top' }}>
							Henkou Status
						</Title>
						<div
							style={{
								display: 'inline-block',
								verticalAlign: 'right'
								// textAlign: 'right'
							}}>
							<Legend
								hideSomeLegends={true}
								title1={'Supplier'}
								title2={'Owner'}></Legend>
						</div>
					</div>
					<Table
						rowKey={(record) => record.id}
						columns={henkouStatusHeader(
							assessment,
							{ handleAction, handleEventStatus },
							checkIfOwner,
							status,
							pendingItems
						)}
						bordered
						dataSource={status.map((item) => {
							return {
								...item,
								logs: item.log ? item.log : item.logs,
								days_in_process: isNaN(
									moment(item.start_date).diff(item.finished_date)
								)
									? ''
									: durationAsString(item.start_date, item.finished_date),
								product_key: master.affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? master.products
										? master.products.find(
												(el) =>
													el.id ==
													master.affectedProducts.find(
														(el) => el.id == item.affected_id
													).product_category_id
										  ).product_key
										: null
									: null
							};
						})}
						scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
					/>
				</div>
			) : (
				''
			)}
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});
export default connect(mapStateToProps)(HenkouContainer);
