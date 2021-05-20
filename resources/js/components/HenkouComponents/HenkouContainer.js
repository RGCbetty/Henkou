/* Utilities */
import React, { useState } from 'react';
import moment from 'moment';
import Http from '../../Http';
import { connect } from 'react-redux';

/* Material Design */
import {
	Form,
	Row,
	Col,
	Input,
	Typography,
	notification,
	Modal,
	Table,
	Button,
	List,
	Spin,
	BackTop
} from 'antd';
import { DownOutlined, UpOutlined, PaperClipOutlined } from '@ant-design/icons';
/* Component */
import { henkouStatusHeader } from '../HenkouComponents/HenkouStatusHeader';
import { PlanCustomerInformation } from './PlanCustomerInformation';
import PendingHeaders from '../HenkouComponents/PendingHeaders';
import Legend from '../Legend';
import ActionHeaders from './ActionHeaders';
/* Utilities */
import { completeDetailsStatus } from '../../api/status';
import durationAsString from '../../utils/diffDate';
/* Utilities */
const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const HenkouContainer = ({ events, props, user }) => {
	const { plan, assessment, products, logs, productsByFirstIndex } = props;
	const [state, setState] = useState({
		showCollapse: false,
		showPlanDetails: false,

		process: [],
		pendingProcess: [],
		editedPendingProcess: [],
		attachments: [],

		selectOption: [],
		searchingHenkou: false,
		savingHenkou: false,
		// MODAL
		pendingProductsModalTitle: '',
		attachmentModalTitle: '',
		processModalTitle: '',
		attachmentModal: false,
		pendingProductsModal: false,
		processModal: false
	});
	const {
		pendingProductsModalTitle,
		pendingProductsModal,
		attachmentModalTitle,
		processModalTitle,
		processModal,
		showCollapse,
		showPlanDetails,
		searchingHenkou,
		savingHenkou,
		attachments,
		pendingProcess,
		editedPendingProcess,
		process,
		selectOption
	} = state;
	// const [showCollapse, setShowCollapse] = useState(false);
	// const [showDetails, setExpand] = useState(false);
	// const [row, setRow] = useState({});
	const [isVisible, setVisibilty] = useState({
		pendingTitle: '',
		attachmentTitle: '',
		actionTitle: '',
		attachmentModal: false,
		pendingModal: false,
		actionModal: false
	});
	// const [onSearchLoading, setOnSearchLoading] = useState(false);
	// const [confirmLoading, setConfirmLoading] = useState(false);
	// const [attachments, setAttachments] = useState([]);
	const [pendingItems, setPendingItems] = useState([]);
	const [editedPendingItems, setEditedPendingItems] = useState([]);
	const [actionItems, setActionItems] = useState([]);
	const [options, setOptions] = useState([]);
	const [form] = Form.useForm();
	/* HENKOU PROCESS */
	// const uniqueProducts = _.uniqBy(concatenatedProducts, (obj) => obj.product_key);
	const checkIfOwner = (record) => {
		if (
			record.is_rechecking &&
			record.assessment_id == 1
			// record.section == rest.user.SectionName &&
			// record.team == rest.user.TeamName
		) {
			return false;
		} else if (
			record.affected_product.product_category.designations.some(
				(designation) => designation.department_id == user.DepartmentCode
			) &&
			!record.is_rechecking
		) {
			return false;
		} else {
			return true;
		}
	};
	const handleActionStatus = (record, key, isPendingItems = null) => {
		record[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
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
			if (record.pending_id) {
				const editedItem = [];
				if (
					editedPendingItems.findIndex((item) => {
						item.pending_index == record.pending_index;
					}) == -1
				) {
					editedItem.push(record);
					setEditedPendingItems(editedItem);
				} else {
					editedItem[
						editedPendingItems.findIndex((item) => {
							item.pending_index == record.pending_index;
						})
					] = record;
					setEditedPendingItems(editedItem);
				}
			}

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
			// console.log
			const cloneActionItems = [...actionItems];
			setActionItems(cloneActionItems);
		}
	};
	const handleEventStatus = (e, key, record) => {
		if (key == 'assessment_id') {
			record[key] = e;
		} else if (key == 'log') {
			record[key] = e.target.value;
		} else if (key == 'start_date' || key == 'finished_date') {
			record[key] = moment()
				.utc()
				.local()
				.format('YYYY-MM-DD HH:mm:ss');
		}
		events.handleUpdate(plan, record, key);
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
		setState((prevState) => ({ ...prevState, searchingHenkou: true }));
		const result = await events.handleEvent(e.target.value);
		result == 'found'
			? setState((prevState) => ({ ...prevState, showPlanDetails: true, showCollapse: true }))
			: (setState((prevState) => ({
					...prevState,
					showPlanDetails: false,
					showCollapse: false
			  })),
			  openNotificationWithIcon('info'));
		setState((prevState) => ({ ...prevState, searchingHenkou: false }));
	};
	/*  */
	/* PENDING MODAL */
	const handleActionPending = async (record) => {
		const { pendings, affected_product, ...rest } = record;
		const { product_name } = affected_product.product_category;
		// console.log(record);
		console.log(rest, 'resrsrst');
		// const pendingResource = await Http.get(
		// 	`api/henkou/plans/pending/${plan.customer_code}/${record.affected_id}`
		// );
		setState((prevState) => ({
			...prevState,
			pendingProductsModalTitle: product_name,
			pendingProductsModal: true,
			pendingProcess:
				pendings.length > 0
					? pendings
					: [
							{
								pending_id: null,
								pending_index: 1,
								start: '',
								reason: '',
								remarks: '',
								borrow_details: '',
								resume: '',
								duration: '',
								...rest,
								updated_by: ''
							}
					  ]
		}));
		// if (pendings.length == 0) {
		// 	if (pendingProcess.length == 0) {
		// 		// setPendingItems([]);
		// 		let pending = [];
		// 		for (let i = 0; i < 1; i++) {
		// 			pending.push({
		// 				pending_id: null,
		// 				pending_index: i + 1,
		// 				rev_no: plan.rev_no,
		// 				customer_code: plan.customer_code,
		// 				start: '',
		// 				reason: '',
		// 				remarks: '',
		// 				borrow_details: '',
		// 				resume: '',
		// 				duration: '',
		// 				...record,
		// 				updated_by: user.EmployeeCode
		// 			});
		// 		}
		// 		setPendingItems(pending);
		// 	}
		// } else if (pendingItems.length == 0) {
		// 	setPendingItems((prevState) => {
		// 		return [
		// 			...prevState,
		// 			pendingResource.data.map((item, index) => {
		// 				return {
		// 					pending_id: item.id,
		// 					pending_index: index + 1,
		// 					start: item.start_date,
		// 					resume: item.resume_date,
		// 					...item,
		// 					id: item.status_id
		// 				};
		// 			})
		// 		];
		// 	});
		// }
		// setRow({ ...row });

		// setVisibilty({ ...isVisible, pendingModal: true });
	};

	const handlePendingOk = async () => {
		setVisibilty({ ...isVisible, pendingModal: false });
		// setPendingItems([]);
		// setRow({ ...row, disableFinish: false });
		// setRow({});
	};

	const handlePendingCancel = () => {
		setState((prevState) => ({
			...prevState,
			// pendingProductsModalTitle: product_name,
			pendingProductsModal: false,
			pendingProcess: prevState.pendingProcess.filter((item) => item.pending_id)
		}));
		// const filterPendingItems = pendingItems.filter((item) => item.pending_id);
		// setPendingItems(filterPendingItems);
		// setRow({});
	};

	const addPendingItems = (record) => {
		function getMaxPendingID() {
			return pendingItems.reduce(
				(max, obj) => (obj.pending_index > max ? obj.pending_index : max),
				pendingItems[0].pending_index
			);
		}
		pendingItems.push({
			pending_id: null,
			pending_index: getMaxPendingID() + 1,
			rev_no: plan.rev_no,
			customer_code: plan.customer_code,
			updated_by: user.EmployeeCode,
			start: '',
			reason: '',
			borrow_details: '',
			remarks: '',
			resume: '',
			duration: '',
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
	const handleReasonInput = (record, key, e) => {
		record[key] = e.target.value;
		pendingItems[
			pendingItems.findIndex((item) => item.pending_index == record.pending_index)
		] = record;
		if (record.pending_id) {
			const editedItem = [];
			if (
				editedPendingItems.findIndex((item) => {
					item.pending_index == record.pending_index;
				}) == -1
			) {
				editedItem.push(record);
				setEditedPendingItems(editedItem);
			} else {
				editedItem[
					editedPendingItems.findIndex((item) => {
						item.pending_index == record.pending_index;
					})
				] = record;
				setEditedPendingItems(editedItem);
			}
		}
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
		const { data, status } = await Http.get(`/api/henkou/attachments/${plan.id}`);
		if (status == 200) {
			setState((prevState) => ({ ...prevState, attachments: data }));
			setVisibilty({ ...isVisible, attachmentModal: true });
		}
	};
	/* ATTACHMENT MODAL */
	/* ACTION MODAL */
	const handleAction = async (record) => {
		console.log(record);
		const { pendings } = record;
		const { product_name } = record.affected_product.product_category;
		// console.log(record);
		// const pendingResource = await Http.get(
		// 	`api/henkou/plans/pending/${plan.customer_code}/${record.affected_id}`
		// );
		setState((prevState) => ({
			...prevState,
			processModal: true,
			processModalTitle: product_name,
			pendingProcess: pendings.map((item, index) => {
				return {
					pending_id: item.id,
					pending_index: index + 1,
					start: item.start_date,
					resume: item.resume_date,
					...item,
					id: item.status_id
				};
			}),
			process: productsByFirstIndex
				.filter((item) => item.affected_id == record.affected_id)
				.map((item, index) => {
					return {
						disableHistory: products.length == index + 1 ? false : true,
						status_index: index + 1,
						...item,

						days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
							? ''
							: durationAsString(item.start_date, item.finished_date)
					};
				})
		}));
		// setPendingItems(
		// 	pendings.map((item, index) => {
		// 		return {
		// 			pending_id: item.id,
		// 			pending_index: index + 1,
		// 			start: item.start_date,
		// 			resume: item.resume_date,
		// 			...item,
		// 			id: item.status_id
		// 		};
		// 	})
		// );
		// setActionItems(
		// 	productsByFirstIndex
		// 		.map((item, index) => {
		// 			return {
		// 				disableHistory: products.length == index + 1 ? false : true,
		// 				status_index: index + 1,
		// 				...item,

		// 				days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
		// 					? ''
		// 					: durationAsString(item.start_date, item.finished_date)
		// 			};
		// 		})
		// 		.filter((item) => item.affected_id == record.affected_id)
		// );
		// setActionItems(await completeDetailsStatus(record, plan));
		// setRow(record);
		// setVisibilty({ ...isVisible, actionModal: true });
	};

	const handleActionOk = async () => {
		setConfirmLoading(true);
		const insertNewPendingItems = pendingItems.filter((item) => {
			return !item.pending_id && (item.start || item.resume || item.reason);
		});

		function getMaxActionID() {
			return actionItems.reduce(
				(max, obj) => (obj.status_index > max ? obj.status_index : max),
				actionItems[0].status_index
			);
		}

		if (
			pendingItems.some((row) => row.reason.match(/borrow form/gi) && !row.pending_id) ||
			pendingItems.some((row) => row.reason.match(/borrow/gi) && !row.pending_id)
		) {
			events.handleBorrow(plan, actionItems[getMaxActionID() - 1]);
			await events.consolidatedHenkouLogs(plan);
		} else {
			events.handleUpdateWithDetails(plan, actionItems[getMaxActionID() - 1]);
		}
		if (insertNewPendingItems.length > 0) {
			const response = await Http.post('/api/henkou/plans/pending', insertNewPendingItems);
			await events.consolidatedHenkouLogs(plan);
		} else if (editedPendingItems.length > 0) {
			const response = await Http.post('/api/henkou/plans/pending', editedPendingItems);
			await events.consolidatedHenkouLogs(plan);
		}

		// }

		// const filteredPendingItems = pendingItems.filter((item) => {
		// 	return item.start || item.resume || item.reason;
		// });
		// if (filteredPendingItems.length > 0) {
		// 	const response = await Http.post('/api/henkou/pending', filteredPendingItems);
		// }
		setConfirmLoading(false);
		setVisibilty({ ...isVisible, actionModal: false });
		setPendingItems([]);
		setRow({});
	};

	const handleActionCancel = () => {
		setState((prevState) => ({
			...prevState,
			processModal: false,
			pendingProcess: []
			// process: productsByFirstIndex
			// 	.map((item, index) => {
			// 		return {
			// 			disableHistory: products.length == index + 1 ? false : true,
			// 			status_index: index + 1,
			// 			...item,

			// 			days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
			// 				? ''
			// 				: durationAsString(item.start_date, item.finished_date)
			// 		};
			// 	})
			// 	.filter((item) => item.affected_id == record.affected_id)
		}));
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

	const onFocus = (value) => {
		setState((prevState) => ({
			...prevState,
			selectOption: !value
				? []
				: [
						{
							value: 'Borrow Form'
						}
				  ]
		}));
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
			<Spin
				tip="Loading..."
				wrapperClassName="ant-advanced-search-form"
				spinning={searchingHenkou}>
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
							{plan?.created_at && (
								<Input
									addonBefore="Registration Date"
									value={
										plan
											? moment(plan.created_at)
													.utc()
													.local()
													.format('YYYY-MM-DD HH:mm:ss')
											: ''
									}
									style={{ width: 300 }}
								/>
							)}
						</Col>

						{showPlanDetails ? (
							PlanCustomerInformation(plan).map((item, index) => (
								<Col style={{ textAlign: item.textAlign }} span={8} key={index}>
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
						{showCollapse ? (
							<Col span={24} style={{ textAlign: 'right' }}>
								<a
									style={{ fontSize: 12 }}
									onClick={() => {
										setState((prevState) => ({
											...prevState,
											showPlanDetails: !showPlanDetails
										}));
									}}>
									{!showPlanDetails ? <UpOutlined /> : <DownOutlined />} Collapse
								</a>
							</Col>
						) : null}
					</Row>
					<Row>
						<Col span={24}>
							{logs.length > 0 && (
								<>
									<span>Summary(Henkou Details)</span>
									<TextArea
										placeholder="Summary(Henkou Details)"
										autoSize
										value={
											logs.length > 0
												? logs
														.filter(
															(item) =>
																item.log || item.borrow_details
														)
														.map((stat, index) => {
															if (stat.log) {
																if (index == 0) {
																	return `${moment
																		.utc(stat.created_at)
																		.format(
																			'YYYY-MM-DD, h:mm:ss a'
																		)} Registered By:${
																		stat.updated_by
																	}(${stat.rev_no}):   ${
																		stat.log
																	}`;
																} else {
																	return `\n${moment
																		.utc(stat.created_at)
																		.format(
																			'YYYY-MM-DD, h:mm:ss a'
																		)}  ${stat.product_name}(${
																		stat.rev_no
																	}):   ${stat.log}`;
																}
															} else if (stat.borrow_details) {
																if (index == 0) {
																	return `${moment
																		.utc(stat.created_at)
																		.format(
																			'YYYY-MM-DD, h:mm:ss a'
																		)}  ${stat.product_name}(${
																		stat.rev_no
																	}):   ${stat.borrow_details}`;
																} else {
																	return `\n${moment
																		.utc(stat.created_at)
																		.format(
																			'YYYY-MM-DD, h:mm:ss a'
																		)}  ${stat.product_name}(${
																		stat.rev_no
																	}):   ${stat.borrow_details}`;
																}
															}
														})
														.join('')
												: ''
										}
										rows={5}></TextArea>
								</>
							)}
						</Col>
					</Row>
					{products.length > 0 && (
						<div style={{ padding: 5 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div className="title-page">Henkou Status</div>
								{/* <Title
									level={4}
									style={{
										margin: 0,
										display: 'inline-block',
										verticalAlign: 'top'
									}}>
									Henkou Status
								</Title> */}
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
									products,
									pendingItems
								)}
								bordered
								pagination={false}
								dataSource={products.map((item) => {
									return {
										...item,
										days_in_process: isNaN(
											moment(item.start_date).diff(item.finished_date)
										)
											? ''
											: durationAsString(item.start_date, item.finished_date)
									};
								})}
								summary={() => {
									if (logs.length > 0) {
										const ReversedLogs = [...logs].reverse();
										const firstProcess = logs.find((item) => item.start_date);
										const finalChecking = ReversedLogs.findIndex(
											(item) =>
												item.affected_id == 5 ||
												item.affected_id == 25 ||
												item.affected_id == 36 ||
												item.affected_id == 58
										);
										const totalDuration = durationAsString(
											firstProcess ? firstProcess.start_date : 0,
											ReversedLogs[finalChecking].finished_date
										);
										return (
											ReversedLogs[finalChecking].finished_date && (
												<Table.Summary.Row>
													<Table.Summary.Cell align="center" colSpan={2}>
														<Text keyboard> Total Duration</Text>
													</Table.Summary.Cell>
													<Table.Summary.Cell align="center" colSpan={5}>
														{totalDuration}
													</Table.Summary.Cell>
												</Table.Summary.Row>
											)
										);
									}
								}}
								scroll={{ x: 'max-content' }}
							/>
						</div>
					)}
				</Form>
				<Modal
					title={attachmentModalTitle}
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
					title={pendingProductsModalTitle}
					onOk={handlePendingOk}
					okText="Save"
					onCancel={handlePendingCancel}
					bodyStyle={{ padding: 10 }}
					width={800}
					visible={pendingProductsModal}>
					{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
					<Table
						rowKey={(record) => record.pending_index}
						columns={PendingHeaders(handleActionStatus, handleReasonInput, user, {
							data: selectOption,
							onFocus,
							onSelect
						})}
						dataSource={pendingProcess}
						pagination={false}
						bordered
					/>
					<div style={{ textAlign: 'right' }}>
						<Button
							style={{ margin: 10 }}
							type="primary"
							disabled={pendingProcess.some((item) => {
								return !item.resume;
							})}
							onClick={() => addPendingItems(row)}>
							Add
						</Button>
					</div>
				</Modal>
				<Modal
					title={processModalTitle}
					onOk={handleActionOk}
					okText="Save"
					onCancel={handleActionCancel}
					bodyStyle={{ padding: 10 }}
					width={1000}
					confirmLoading={savingHenkou}
					visible={processModal}>
					{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
					<Table
						rowKey={(record) => record.status_index}
						columns={ActionHeaders(
							handleActionStatus,
							handleActionDetails,
							handleActionPending,
							checkIfOwner,
							pendingItems
						)}
						dataSource={process}
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
			</Spin>
			<BackTop></BackTop>
		</>
	);
};
const mapStateToProps = (state) => ({
	user: state.auth.user
});
export default connect(mapStateToProps)(HenkouContainer);
