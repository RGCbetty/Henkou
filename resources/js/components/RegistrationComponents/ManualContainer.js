import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Form,
	Row,
	Col,
	Input,
	Button,
	Select,
	Typography,
	DatePicker,
	Modal,
	Upload,
	notification,
	Table,
	Spin,
	Alert,
	message
} from 'antd';
import { DownOutlined, UpOutlined, UploadOutlined, SnippetsOutlined } from '@ant-design/icons';

import { planStatusHeaders } from '../RegistrationComponents/PlanStatus(PCMS)Header';
import PendingHeaders from '../HenkouComponents/PendingHeaders';
import headers from '../RegistrationComponents/HenkouStatusHeader';
import PlanDetails from '../RegistrationComponents/PlanDetails';

import moment from 'moment';
import Http from '../../Http';
import TextLoop from 'react-text-loop';

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Title } = Typography;
const ManualContainer = ({
	handleSpecs,
	details,
	handleOnChange,
	handleRegister,
	handleClearDetails,
	status,
	pending,
	logs,
	...rest
}) => {
	const { master } = rest;
	/* PCMS */
	// const [assignedProductCategoriesPCMS, setPlanDetail] = useState([]);
	// const [productCategoriesPCMS, setProductCategoriesPCMS] = useActivePlanStatus();
	// const [userProductCategoriesPCMS, setUserProducts] = useState([]);
	// const [subProductPCMS, setSubProduct] = useState(false);
	// const [loading, setLoading] = useState(false);
	// const [visible, setVisible] = useState(false);
	/* PCMS */
	const [henkouLoading, setHenkouLoading] = useState(false);
	const [expand, setExpand] = useState(false);
	const [showDetails, setDetails] = useState(false);
	const [upload, setUpload] = useState({
		fileList: [],
		status: false
	});
	const [existState, setExistState] = useState({
		showDetails: false,
		showDepartments: false,
		span: 12,
		toggleBorrowBtn: true,
		message: '',
		description: '',
		department: '',
		showAlert: false
	});
	const [form] = Form.useForm();
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};

	const openNotificationWithIcon = (type, result) => {
		if (result.status == 'found') {
			notification[type]({
				description: result.msg
			});
			// message.success('Not yet started! ' + result.msg, 0);
		} else if (result.status == 'ongoing') {
			// notification[type]({
			// 	message: 'On-going!',
			// 	description: result.msg
			// });
			setExistState({
				...existState,
				showDetails: false,
				message: 'Ongoing!',
				description: result.msg,
				department: result.dept,
				showAlert: true,
				toggleBorrowBtn: false
			});

			// message.info('Ongoing! ' + result.msg, 0);
		} else if (result.status == 'notyetstarted') {
			// notification[type]({
			// 	description: result.msg
			// });
			setExistState({
				...existState,
				message: 'Not yet started!',
				description: result.msg,
				department: result.dept,
				showAlert: true,
				showDetails: false
			});

			// message.info('Not yet started! ' + result.msg, 0);
		} else {
			notification[type]({
				message: 'Plan not registered!'
			});
		}
	};
	const handleEvent = async (value, keys = null) => {
		setHenkouLoading(true);
		try {
			if (!henkouLoading) {
				if (!keys) {
					const e = value;
					e.preventDefault();
					const result = await handleSpecs(e.target.value);
					result.status == 'found'
						? (setExpand(true),
						  setDetails(true),
						  setExistState({
								...existState,
								showDetails: true
						  }),
						  openNotificationWithIcon('info', result))
						: result.status == 'ongoing'
						? (setExpand(true),
						  setDetails(true),
						  openNotificationWithIcon('info', result))
						: result.status == 'notyetstarted'
						? (setExpand(true),
						  setDetails(true),
						  openNotificationWithIcon('info', result))
						: (setExpand(false),
						  setDetails(false),
						  openNotificationWithIcon('info', result));
					// setExpand(true);
				} else {
					if (keys == 'reason_id') {
						if (value == 0) {
							setExistState({
								...existState,
								showDepartments: true,
								span: 8
							});
						} else {
							setExistState({
								...existState,
								showDepartments: false,
								span: 8
							});
						}
					}

					handleOnChange(value, keys);
				}
			}
		} catch (err) {
			// console.error(err);
			message.error('Please input valid code.');
		}
		setHenkouLoading(false);
	};
	const handleRegisterAndUpload = async (details) => {
		/* Coming from Registration.js */
		await handleRegister(details);
		/* Coming from Registration.js */
		const { fileList } = upload;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('files[]', file);
		});
		if (fileList.length > 0) {
			setUpload({
				status: true
			});
			// You can use any AJAX library you like
			try {
				const response = await Http.get(`/api/details/${details.customer_code}`);
				const uploadResponse = await Http.post(
					`/api/henkou/attachment/${response.data.id}`,
					formData
				);
				setUpload({
					fileList: [],
					status: true
				});
			} catch (error) {
				setUpload({
					fileList: [],
					status: true
				});
			}
		}
	};

	/* const uploadProps = {
		name: 'file',
		multiple: true,
		action: `/api/henkou/attachment/${details.customer_code}`,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		},
		withCredentials: true,
		onChange(info) {
			if (info.file.status !== 'uploading') {
				console.log(info);

				// console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		}
    }; */
	const uploadProps = {
		onRemove: (file) => {
			setUpload((state) => {
				const index = state.fileList.indexOf(file);
				const newFileList = state.fileList.slice();
				newFileList.splice(index, 1);
				return {
					fileList: newFileList
				};
			});
		},
		beforeUpload: (file) => {
			setUpload((state) => ({
				fileList: [...state.fileList, file]
			}));
			return false;
		},
		fileList: upload.fileList,
		multiple: true
	};
	const resetData = () => {
		form.resetFields();
		handleClearDetails();
		setDetails(false);
		setExpand(false);
	};
	return (
		<>
			<Spin
				tip="Loading..."
				wrapperClassName="ant-advanced-search-form"
				spinning={henkouLoading}>
				<Form
					layout={'horizontal'}
					form={form}
					name="advanced_search"
					className="ant-advanced-search-form"
					onFinish={onFinish}>
					<Row gutter={[10, 10]}>
						<Col span={8}>
							<Form.Item
								name={`CustomerCode`}
								style={{ marginBottom: '0px' }}
								rules={[
									{
										required: true,
										message: 'Input something!'
									}
								]}>
								<Search
									placeholder="Enter Code"
									allowClear
									onPressEnter={handleEvent}
									addonBefore="Customer Code"
									style={{ width: 300, margin: '0 0' }}></Search>
							</Form.Item>
						</Col>
						{existState.showAlert && (
							<Col span={6}>
								{/* <Form.Item
									name={`Product`}
									style={{ marginBottom: '0px' }}
									rules={[
										{
											required: true,
											message: 'Input something!'
										}
									]}> */}
								<Alert
									banner
									message={
										<TextLoop mask>
											<div>{existState.message}</div>
											<div>{existState.description}</div>
											<div>{existState.department}</div>
											{/* <div>Notice message three</div>
											<div>Notice message four</div> */}
										</TextLoop>
									}
									// description={existState.description}
								/>
								{/* <Alert
									message={existState.message}
									description={existState.description}
									type="info"
									closeText="Close Now"
								/> */}
								{/* </Form.Item> */}
							</Col>
						)}

						<Col
							offset={existState.message ? 6 : 12}
							span={4}
							style={{ textAlign: 'right' }}>
							<DatePicker
								defaultValue={moment(
									moment()
										.utc()
										.local()
										.format('YYYY-MM-DD'),
									dateFormat
								)}
								// inputReadOnly
								disabledDate={() => true}
								format={dateFormat}
							/>
						</Col>

						{showDetails
							? PlanDetails(details).map((item, index) => (
									<Col style={{ textAlign: item.textAlign }} span={8} key={index}>
										{/* <Form.Item
											name={item.name}
											initialValue={item.value}
											style={{ marginBottom: '0px' }}
											rules={[
												{
													required: true,
													message: 'Input something!'
												}
											]}> */}
										<Input
											readOnly
											value={item.value}
											addonBefore={item.title}
											style={{ width: item.width }}
										/>
										{/* </Form.Item> */}
									</Col>
							  ))
							: null}
					</Row>
					{expand ? (
						<>
							<a
								style={{ fontSize: 12, textAlign: 'right' }}
								onClick={() => {
									setDetails(!showDetails);
								}}>
								{showDetails ? <UpOutlined /> : <DownOutlined />} Collapse
							</a>
							{existState.showDetails ? (
								<>
									<Row gutter={[16, 16]}>
										<Col span={24} style={{ textAlign: 'center' }}>
											<Form.Item
												name={`Henkou Details`}
												label={`Henkou Details`}
												style={{ marginBottom: '0px' }}>
												<TextArea
													autoSize
													value={details.logs}
													onChange={(value, event) =>
														handleEvent(value, 'logs')
													}></TextArea>
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={[16, 16]} justify="center">
										<Col span={8}>
											<Form.Item
												name={`Henkou Type`}
												label={`Henkou Type`}
												style={{ marginBottom: '0px' }}>
												<Select
													style={{ width: 150 }}
													onChange={(value, event) =>
														handleEvent(value, 'type_id')
													}>
													{master.types.map((item, index) => {
														return (
															<Option
																value={item.type_id}
																key={index}>
																{item.type_name}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												name={`Henkou Reason`}
												label={`Henkou Reason`}
												style={{
													marginBottom: '0px'
												}}>
												<Select
													style={{ width: 160 }}
													onChange={(value, event) =>
														handleEvent(value, 'reason_id')
													}>
													{master.reasons.map((item, index) => {
														return (
															<Option
																value={item.reason_id}
																key={index}>
																{item.reason_name}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
										</Col>
										{existState.showDepartments && (
											<Col span={existState.span}>
												<Form.Item
													name={`Departments`}
													label={`Departments`}
													style={{
														marginBottom: '0px'
													}}>
													<Select
														style={{ width: 200 }}
														onChange={(value, event) =>
															handleEvent(value, 'department_id')
														}>
														{master.departments.map((item, index) => {
															return (
																<Option
																	value={item.DepartmentCode}
																	key={index}>
																	{item.DepartmentName}
																</Option>
															);
														})}
													</Select>
												</Form.Item>
											</Col>
										)}
									</Row>
									<Row>
										<Col span={12}>
											<Button
												type="primary"
												onClick={() => {
													window.open(
														'http://localhost:3000/storage/HenkouForm.xls'
													);
												}}
												style={{ margin: '0 8px' }}
												icon={<SnippetsOutlined />}
												htmlType="button">
												Henkou Form
											</Button>
											<Upload {...uploadProps}>
												<Button
													type="primary"
													icon={<UploadOutlined />}
													htmlType="button">
													Upload
												</Button>
											</Upload>
										</Col>

										<Col span={12} style={{ textAlign: 'right' }}>
											<Button
												style={{ margin: '0 8px' }}
												onClick={() => {
													resetData();
													// setShowCollapse(false);
													// setExpand(false);
												}}>
												Clear
											</Button>
											{/* <Button
								type="primary"
								htmlType="submit"
								onClick={() => setVisible(true)}>
								Close
							</Button> */}
											<Button
												type="primary"
												// htmlType="submit"
												onClick={() => handleRegisterAndUpload(details)}>
												Save
											</Button>
											{/* <Button
								type="primary"
								htmlType="button"
								onClick={() => onClickPlanStatusBtn()}>
								Plan Status
							</Button>
							<Modal
								title="Plan Status (PCMS)"
								bodyStyle={{ padding: 10 }}
								centered
								visible={visible}
								onOk={() => setVisible(false)}
								onCancel={() => setVisible(false)}
								width={1500}>
								<Table
									style={{ marginTop: 10 }}
									columns={planStatusHeaders}
									loading={loading}
									bordered
									rowKey={(record) => record.id}
									dataSource={assignedProductCategoriesPCMS.map((item, index) => {
										if (index == 0) {
											return {
												id: index + 1,
												...item,
												position: 'center'
											};
										} else {
											return {
												id: index + 1,
												...item,
												position: 'center'
											};
										}
									})}
									scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
								/>
							</Modal> */}
										</Col>
									</Row>
								</>
							) : (
								<>
									<Row>
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
																			)}  ${
																			stat.product_name
																		}(${stat.rev_no}):  ${
																			stat.log
																		}`;
																	} else {
																		return `\n${moment
																			.utc(stat.created_at)
																			.format(
																				'YYYY-MM-DD, h:mm:ss a'
																			)}  ${
																			stat.product_name
																		}(${stat.rev_no}):  ${
																			stat.log
																		}`;
																	}
																} else if (stat.borrow_details) {
																	if (index == 0) {
																		return `${moment
																			.utc(stat.created_at)
																			.format(
																				'YYYY-MM-DD, h:mm:ss a'
																			)}  ${
																			stat.product_name
																		}(${stat.rev_no}):  ${
																			stat.borrow_details
																		}`;
																	} else {
																		return `\n${moment
																			.utc(stat.created_at)
																			.format(
																				'YYYY-MM-DD, h:mm:ss a'
																			)}  ${
																			stat.product_name
																		}(${stat.rev_no}):  ${
																			stat.borrow_details
																		}`;
																	}
																}
															})
															.join('')
													: ''
											}
											rows={5}></TextArea>
									</Row>
									<Row>
										<Col
											span={24}
											style={{ textAlign: 'right', marginTop: '10px' }}>
											<Button
												style={{ margin: '0 8px' }}
												onClick={() => {
													resetData();
												}}>
												Clear
											</Button>

											<Button
												type="primary"
												// htmlType="submit"
												disabled={existState.toggleBorrowBtn}
												onClick={() =>
													pending.actions.handlePendingModal(details)
												}>
												Borrow
											</Button>
										</Col>
									</Row>
								</>
							)}
						</>
					) : null}
				</Form>
				<Modal
					title={`Pending ${pending.state.row.product_name}`}
					onOk={pending.actions.handlePendingOk}
					okText="Save"
					onCancel={pending.actions.handlePendingCancel}
					bodyStyle={{ padding: 10 }}
					width={650}
					visible={pending.state.isPendingModalVisible}>
					<Table
						rowKey={(record) => record.pending_index}
						columns={PendingHeaders(
							pending.actions.handlePendingStatus,
							pending.actions.handleReasonInput,
							{
								data: pending.state.options,
								onFocus: pending.actions.onFocus,
								onSelect: pending.actions.onSelect
							}
						)}
						dataSource={pending.state.items}
						pagination={false}
						bordered
					/>
					<div style={{ textAlign: 'right' }}>
						<Button
							style={{ margin: 10 }}
							type="primary"
							disabled={pending.state.items.some((item) => {
								return !item.resume;
							})}
							onClick={() => pending.actions.handleAddPendingItem()}>
							Add
						</Button>
					</div>
				</Modal>
			</Spin>
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});
export default connect(mapStateToProps)(ManualContainer);
