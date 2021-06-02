/* Utilities */
import React, { useEffect, useState } from 'react';
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
import durationAsString from '../../utils/diffDate';
/* Utilities */
const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const HenkouContainer = ({ events, props, user }) => {
	const { plan, assessment, logs, productsByFirstIndex, fetchingProducts } = props;
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
		pendingProcessModalTitle: '',
		attachmentModalTitle: '',
		processModalTitle: '',
		attachmentModal: false,
		pendingProcessModal: false,
		processModal: false
	});
	const {
		pendingProcessModalTitle,
		pendingProcessModal,
		attachmentModalTitle,
		attachmentModal,
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
	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			process: productsByFirstIndex
			// .map((item, index) => {
			// 	return {
			// 		disableHistory: products.length == index + 1 ? false : true,
			// 		product_id: index + 1,
			// 		...item,
			// 		days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
			// 			? ''
			// 			: durationAsString(item.start_date, item.finished_date)
			// 	};
			// })
		}));
	}, [productsByFirstIndex]);

	const [form] = Form.useForm();

	const checkIfOwner = (record) => {
		if (record.is_rechecking && record.assessment_id == 1) {
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
	const handleOnClickPendingProcessTime = (record, key) => {
		const productIndex = pendingProcess.findIndex(
			(item) => item.pending_index == record.pending_index
		);
		record[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
		if (key == 'start') {
			record.isItemStarted = true;
		}
		if (key == 'resume') {
			// const diff_seconds = moment(row.start).diff(row.resume, 'seconds');
			// const ms = moment(row.resume, 'YYYY-MM-DD HH:mm:ss').diff(
			// 	moment(row.start, 'YYYY-MM-DD HH:mm:ss')
			// );
			// const d = moment.duration(ms);
			record.resume_date = record[key];
			// record.updated_by = user.employee;
			record.duration = isNaN(moment(record.start).diff(record.resume))
				? ''
				: durationAsString(record.start, record.resume);
			// setRow({ ...row });
			// row.pending_id = row.pending_id + 1;
		}
		pendingProcess[productIndex] = record;
		pendingProcess[productIndex].updated_by = user.EmployeeCode;
		console.log(pendingProcess[productIndex], 'peakabooooo!');

		if (record.pending_id) {
			// const editedItem = [];
			if (
				editedPendingProcess.findIndex((item) => {
					item.pending_index == record.pending_index;
				}) == -1
			) {
				// editedItem.push(record);
				setState((prevState) => ({ ...prevState, editedPendingProcess: [{ ...record }] }));
			} else {
				editedPendingProcess[record.pending_index] = record;
				setState((prevState) => ({ ...prevState, editedPendingProcess: [{ ...record }] }));
			}
		}

		const clonePendingProcess = [...pendingProcess];
		setState((prevState) => ({ ...prevState, pendingProcess: clonePendingProcess }));
	};
	const handleOnClickProcessTime = (record, key) => {
		// console.error(record);
		const productIndex = process.findIndex((item) => item.id == record.id);
		record[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
		if (key == 'finished_date') {
			// row.received_date = moment().format('YYYY-MM-DD HH:mm:ss');
			record.days_in_process = isNaN(moment(record.start_date).diff(record.finished_date))
				? ''
				: durationAsString(record.start_date, record.finished_date);
			// setRow({ ...row });
		}

		process[productIndex] = record;
		console.log(process[productIndex], 'peakabooooo!');
		// console.log
		setState((prevState) => ({ ...prevState, process }));
	};

	const handleOnChangeAssessment = async (value, key, record) => {
		record[key] = value;
		await events.handleUpdateAssessment(record);
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
	const showPendingModal = async (record) => {
		const { affected_product, ...rest } = record;
		const {
			updated_by,
			pendings: pendingProcess,
			updated_at,
			created_at,
			employee,
			...product
		} = rest;
		const { pendings, ...prop } = affected_product;
		const { product_name } = affected_product.product_category;
		console.log(rest, 'rest');
		console.log(prop, 'prop');
		console.log(pendings, 'pendings');
		if (pendings?.length > 0) {
			console.log(pendings[pendings.length - 1]);
			if (pendings[pendings.length - 1].resume_date) {
				const pendingProducts = [
					...pendings?.map((item, index) => ({
						...prop?.product_category,
						pending_id: item.id,
						pending_index: index + 1,
						start: item.start_date,
						resume: item.resume_date,
						...item
						// id: item.status_id
					})),
					{
						product_category: prop?.product_category,
						// ...rest,
						...product,
						pending_id: null,
						pending_index: pendings.length + 1,
						start: '',
						reason: '',
						remarks: '',
						borrow_details: '',
						resume: '',
						duration: '',
						updated_by: ''
					}
				];
				setState((prevState) => {
					return {
						...prevState,
						pendingProcessModalTitle: product_name,
						pendingProcessModal: true,
						pendingProcess: pendingProducts
					};
				});
			} else {
				setState((prevState) => {
					return {
						...prevState,
						pendingProcessModalTitle: product_name,
						pendingProcessModal: true,
						pendingProcess: pendings?.map((item, index) => ({
							...prop?.product_category,
							pending_id: item.id,
							pending_index: index + 1,
							start: item.start_date,
							resume: item.resume_date,
							...item
							// id: item.status_id
						}))
					};
				});
			}
		} else {
			setState((prevState) => {
				return {
					...prevState,
					pendingProcessModalTitle: product_name,
					pendingProcessModal: true,
					pendingProcess: [
						{
							product_category: prop?.product_category,
							// ...rest,
							...product,
							pending_id: null,
							pending_index: 1,
							start: '',
							reason: '',
							remarks: '',
							borrow_details: '',
							resume: '',
							duration: '',
							updated_by: ''
						}
					]
				};
			});
		}
	};

	const handlePendingOk = async () => {
		setState((prevState) => ({
			...prevState,
			pendingProcessModal: false
		}));
	};

	const handlePendingCancel = () => {
		setState((prevState) => ({
			...prevState,
			pendingProcessModal: false
			// pendingProcess: prevState.pendingProcess.filter((item) => item.pending_id)
		}));
	};

	const addPendingItems = () => {
		// function getMaxPendingID() {
		// 	return pendingProcess.reduce(
		// 		(max, obj) => (obj.pending_index > max ? obj.pending_index : max),
		// 		pendingProcess[0].pending_index
		// 	);
		// }
		pendingProcess.push({
			pending_id: null,
			pending_index: pendingProcess.length + 1,
			rev_no: plan.rev_no,
			customer_code: plan.customer_code,
			updated_by: user.EmployeeCode,
			start: '',
			reason: '',
			borrow_details: '',
			remarks: '',
			resume: '',
			duration: ''
			// ...record
		});
		const clonePendingProcess = [...pendingProcess];
		setState((prevState) => ({ ...prevState, pendingProcess: clonePendingProcess }));
	};
	const handleProcessDetails = (record, e) => {
		const productIndex = process.findIndex((item) => item.id == record.id);
		record.log = e.target.value;
		process[productIndex] = record;
		// const cloneProcess = [...process];
		setState((prevState) => ({ ...prevState, process }));
	};
	const handlePendingReasonInput = (record, key, e) => {
		const productIndex = pendingProcess.findIndex(
			(item) => item.pending_index == record.pending_index
		);
		record[key] = e.target.value;
		pendingProcess[productIndex] = record;
		pendingProcess[productIndex].updated_by = user.EmployeeCode;
		if (record.pending_id) {
			if (
				editedPendingProcess.findIndex((item) => {
					item.pending_index == record.pending_index;
				}) == -1
			) {
				setState((prevState) => ({ ...prevState, editedPendingProcess: [{ ...record }] }));
			} else {
				editedPendingProcess[record.pending_index] = record;
				setState((prevState) => ({ ...prevState, editedPendingProcess: [{ ...record }] }));
			}
		}
		const clonePendingProcess = [...pendingProcess];
		setState((prevState) => ({ ...prevState, pendingProcess: clonePendingProcess }));
	};
	/* PENDING MODAL */
	/* ATTACHMENT MODAL */
	const attachmentModalOk = () => {
		setState((prevState) => ({
			...prevState,
			attachmentModal: false
		}));
	};
	const attachmentModalCancel = () => {
		setState((prevState) => ({
			...prevState,
			attachmentModal: false
		}));
	};
	const handleAttachmentModal = async () => {
		const { data, status } = await Http.get(`/api/henkou/attachments/${plan.id}`);
		if (status == 200) {
			setState((prevState) => ({ ...prevState, attachments: data, attachmentModal: true }));
		}
	};
	/* ATTACHMENT MODAL */
	/* ACTION MODAL */
	const handleAction = async (record) => {
		console.log(record, 'younggoooooooood');
		const { pendings } = record.affected_product;
		const { product_name } = record.affected_product.product_category;
		setState((prevState) => ({
			...prevState,
			pendingProcess:
				pendings?.length > 0
					? pendings?.map((item, index) => {
							return {
								pending_id: item.id,
								pending_index: index + 1,
								start: item.start_date,
								resume: item.resume_date,
								...item,
								id: item.status_id
							};
					  })
					: [
							{
								...record,
								pending_id: null,
								pending_index: 1,
								start: '',
								reason: '',
								remarks: '',
								borrow_details: '',
								resume: '',
								duration: '',
								updated_by: ''
							}
					  ],
			process: process
				.filter((item) => item.affected_id == record.affected_id)
				.map((item, index) => {
					return {
						// disableHistory: products.length == index + 1 ? false : true,
						product_id: index + 1,
						...item,
						days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
							? ''
							: durationAsString(item.start_date, item.finished_date)
					};
				}),
			processModalTitle: product_name,
			processModal: true
		}));
	};

	const handleActionOk = async () => {
		setState((prevState) => ({ ...prevState, savingHenkou: true }));
		const insertNewPendingItems = pendingProcess.filter((item) => {
			return !item.pending_id && (item.start || item.resume || item.reason);
		});
		const processLatestRevision = process.reduce(
			(max, obj) => (obj.product_id > max ? obj.product_id : max),
			process[0].product_id
		);

		console.log(process, 'processssss');
		if (insertNewPendingItems.length > 0) {
			Http.post('/api/henkou/plans/pending', insertNewPendingItems);
			// await events.consolidatedHenkouLogs(plan);
		} else if (editedPendingProcess.length > 0) {
			Http.post('/api/henkou/plans/pending', editedPendingProcess);
			// await events.consolidatedHenkouLogs(plan);
		}
		if (
			pendingProcess?.some((row) => row.reason?.match(/borrow form/gi) && !row.pending_id) ||
			pendingProcess?.some((row) => row.reason?.match(/borrow/gi) && !row.pending_id)
		) {
			events.handleBorrow(process[processLatestRevision - 1]);
			// await events.consolidatedHenkouLogs(plan);
		} else {
			events.handleUpdateProduct(process[processLatestRevision - 1]);
		}
		setState((prevState) => ({
			...prevState,
			savingHenkou: false,
			processModal: false,
			pendingProcess: []
		}));
	};

	const handleActionCancel = () => {
		setState((prevState) => ({
			...prevState,
			processModal: false,
			process: productsByFirstIndex,
			pendingProcess: []
		}));
	};

	const onFocus = (value, key, record) => {
		console.log(user, 'focus on me');
		setState((prevState) => ({
			...prevState,
			selectOption:
				!value ||
				record.product_category.designations.some(
					(item) =>
						item.department_id == user.DepartmentCode ||
						item.section_id == user.SectionCode
				)
					? []
					: [
							{
								value: 'Borrow Form'
							}
					  ]
		}));
	};
	const onSelect = (value, key, record) => {
		console.dir(record);
		const productIndex = pendingProcess.findIndex(
			(item) => item.pending_index == record.pending_index
		);
		record[key] = value;
		// console.log(value, key, record, 'Onselect');
		pendingProcess[productIndex] = record;
		pendingProcess[productIndex].updated_by = record;
		const clonePendingProcess = [...pendingProcess];
		setState((prevState) => ({ ...prevState, pendingProcess: clonePendingProcess }));
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
																	return `${moment(
																		stat.created_at
																	).format(
																		'YYYY-MM-DD, h:mm:ss a'
																	)} Registered By:${
																		stat?.employee?.EmployeeName
																	}(${stat.rev_no}):   ${
																		stat.log
																	}`;
																} else {
																	return `\n${moment(
																		stat.created_at
																	).format(
																		'YYYY-MM-DD, h:mm:ss a'
																	)}  ${stat.product_name}(${
																		stat.rev_no
																	}):   ${stat.log}`;
																}
															} else if (stat.borrow_details) {
																if (index == 0) {
																	return `${moment(
																		stat.created_at
																	).format(
																		'YYYY-MM-DD, h:mm:ss a'
																	)}  ${stat.product_name}(${
																		stat.rev_no
																	}):  ${stat.borrow_details}`;
																} else {
																	return `\n${moment(
																		stat.created_at
																	).format(
																		'YYYY-MM-DD, h:mm:ss a'
																	)}  ${stat.product_name}(${
																		stat.rev_no
																	}):  ${stat.borrow_details}`;
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
					{productsByFirstIndex.length > 0 && (
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
									{ handleAction, handleOnChangeAssessment },
									checkIfOwner,
									productsByFirstIndex.filter(
										(item) => item.rev_no == plan.rev_no
									),
									fetchingProducts
								)}
								bordered
								pagination={false}
								dataSource={productsByFirstIndex
									.filter((item) => item.rev_no == plan.rev_no)
									.map((item, index) => {
										return {
											// disableHistory:
											// 	products.length == index + 1 ? false : true,
											// product_id: index + 1,
											...item,
											days_in_process: isNaN(
												moment(item.start_date).diff(item.finished_date)
											)
												? ''
												: durationAsString(
														item.start_date,
														item.finished_date
												  )
										};
									})}
								summary={() => {
									if (productsByFirstIndex.length > 0) {
										const ReversedLogs = [...productsByFirstIndex].reverse();
										const firstProcess = productsByFirstIndex.find(
											(item) => item.start_date
										);
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
					visible={attachmentModal}>
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
					title={pendingProcessModalTitle}
					onOk={handlePendingOk}
					okText="Save"
					onCancel={handlePendingCancel}
					bodyStyle={{ padding: 10 }}
					width={900}
					visible={pendingProcessModal}>
					<Table
						rowKey={(record) => record.pending_index}
						columns={PendingHeaders(
							handleOnClickPendingProcessTime,
							handlePendingReasonInput,
							user,
							{
								data: selectOption,
								onFocus,
								onSelect
							}
						)}
						dataSource={pendingProcess}
						pagination={false}
						bordered
					/>
					{/* <div style={{ textAlign: 'right' }}>
						<Button
							style={{ margin: 10 }}
							type="primary"
							disabled={
								pendingProcess?.some((item) => {
									return !item.resume;
								}) && []
							}
							onClick={() => addPendingItems()}>
							Add
						</Button>
					</div> */}
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
					<Table
						rowKey={(record) => record.product_id}
						columns={ActionHeaders(
							handleOnClickProcessTime,
							handleProcessDetails,
							// handleActionPending,
							showPendingModal,
							checkIfOwner,
							pendingProcess
						)}
						dataSource={process}
						pagination={false}
						bordered
					/>
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
