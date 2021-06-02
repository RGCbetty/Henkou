import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
import {
	Form,
	Row,
	Col,
	Input,
	Button,
	Select,
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
import PendingHeaders from '../HenkouComponents/PendingHeaders';
import RecheckHeader from '../RegistrationComponents/RecheckHeader';
import PlanDetails from '../RegistrationComponents/PlanDetails';
import moment from 'moment';
import Http from '../../Http';

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const ManualContainer = ({
	handleSpecs,
	handleOnChange,
	handleRegister,
	handleClearDetails,
	pending,
	logs,
	props,
	...rest
}) => {
	const { planDetails, departments, types, reasons } = props;
	const [henkouLoading, setHenkouLoading] = useState(false);
	const [expand, setExpand] = useState(false);
	const [showDetails, setDetails] = useState(false);
	const [upload, setUpload] = useState({
		fileList: [],
		status: false
	});
	const [recheck, setRecheck] = useState({
		selectedRowKeys: [],
		modalVisible: false,
		products: []
	});
	const [existState, setExistState] = useState({
		showDetails: false,
		showDepartments: false,
		toggleBorrowBtn: true,
		message: '',
		description: '',
		department: '',
		section: '',
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
		} else if (result.status == 'ongoing') {
			setExistState((prevState) => ({
				...prevState,
				showDetails: false,
				message: 'Ongoing!',
				description: result.msg,
				department: result.dept,
				section: result.sect,
				showAlert: true,
				toggleBorrowBtn: false
			}));
		} else if (result.status == 'notyetstarted') {
			setExistState((prevState) => ({
				...prevState,
				message: 'Not yet started!',
				description: result.msg,
				department: result.dept,
				section: result.sect,
				showAlert: true,
				showDetails: false
			}));
		} else if (result.status == 'notvalid') {
			setExistState((prevState) => ({
				...prevState,
				message: '',
				message: '',
				description: '',
				department: '',
				showAlert: false,
				showDetails: false
			}));
			message.error(result.msg);
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
						  setExistState((prevState) => ({
								...prevState,
								showDetails: true
						  })),
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
				} else {
					if (keys == 'reason_id') {
						if (value == 1) {
							setExistState({
								...existState,
								showDepartments: true
							});
						} else {
							setExistState({
								...existState,
								showDepartments: false
							});
						}
					}

					handleOnChange(value, keys);
				}
			}
		} catch (err) {
			message.error('Please input valid code.');
		}
		setHenkouLoading(false);
	};
	const handleRegisterAndUpload = async () => {
		// await handleRegister(planDetails);
		const { status } = await Http.post('api/henkou/register/kouzou', {
			details: planDetails
		});
		if (status == 200) {
			message.success('Successfully Registered');
		}
		const { fileList } = upload;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('files[]', file);
		});
		if (fileList.length > 0) {
			setUpload({
				status: true
			});
			try {
				const response = await Http.get(`/api/planDetails/${planDetails.customer_code}`);
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
	// RECHECK
	const handleRecheckModal = async () => {
		const planStatusID = planDetails.plan_status_id;
		const { data: products, status } = await Http.get(
			`api/products/planstatus/${planStatusID}`
		);
		console.log(products);
		setRecheck({
			modalVisible: true,
			selectedRowKeys: products
				.filter(
					({ affected_id }) =>
						affected_id !== 5 ||
						affected_id !== 25 ||
						affected_id !== 36 ||
						affected_id !== 58
				)
				.map((item) => item.id),
			products: products.map((item) => {
				return {
					...item,
					assessment: 0
				};
			})
		});
	};
	const onSelectChange = (selectedRowKeys) => {
		setRecheck((prevState) => {
			return {
				...prevState,
				products: prevState.products.map((item) => {
					return {
						...item,
						assessment: selectedRowKeys.some((element) => item.id == element)
							? false
							: true
					};
				}),
				selectedRowKeys
			};
		});
	};
	const onSelectRow = (record, selected, selectedRows, nativeEvent) => {
		const { products } = recheck;
		products[products.findIndex((val) => val.id == record.id)].assessment == 0
			? (products[products.findIndex((val) => val.id == record.id)].assessment = 1)
			: (products[products.findIndex((val) => val.id == record.id)].assessment = 0);
		const newProducts = [...products];
		setRecheck((prevState) => {
			return {
				...prevState,
				products: newProducts
			};
		});
		// console.log(record, selected, selectedRows, nativeEvent);
	};
	const handleRecheckCancel = () => {
		setRecheck({
			modalVisible: false,
			selectedRowKeys: [],
			products: []
		});
	};
	const handleRecheckOk = async () => {
		const { status } = await Http.post('api/henkou/plans/recheck', {
			details: planDetails,
			products: recheck.products
		});
		if (status == 200) {
			message.success('Successfully Registered');
			setRecheck({
				modalVisible: false,
				selectedRowKeys: [],
				products: []
			});
		}
	};
	// RECHECK
	/* const uploadProps = {
		name: 'file',
		multiple: true,
		action: `/api/henkou/attachment/${planDetails.customer_code}`,
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

	const resetData = () => {
		form.resetFields();
		handleClearDetails();
		setExistState({});
		setDetails(false);
		setExpand(false);
	};

	const generateHenkouForm = async () => {
		const instance = Http.create({
			baseURL: 'http://10.169.141.101:8070/',
			withCredentials: false
		});
		const { data } = await instance.get('api/xlsx/henkou/form', {
			params: planDetails,
			responseType: 'arraybuffer'
		});

		// console.log(data);
		// function s2ab(s) {
		// 	var buf = new ArrayBuffer(s.length);
		// 	var view = new Uint8Array(buf);
		// 	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
		// 	return buf;
		// }
		// let blob = new Blob([s2ab(data)], {
		// 	type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		// });
		const blob = new Blob([data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		saveAs(blob, 'HenkoForm.xlsx');
		// const henkou = XLSX.read(data);
		// const wbout = XLSX.write(henkou, { bookType: 'xlsx', bookSST: false, type: 'binary' });
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
									onChange={(e) => {
										if (e.type == 'click') {
											resetData();
										}
									}}
									onPressEnter={handleEvent}
									addonBefore="Customer Code"
									style={{ width: 300, margin: '0 0' }}></Search>
							</Form.Item>
						</Col>
						{existState.showAlert && (
							<Col span={8}>
								<Alert
									banner
									message={<span>{existState.message}</span>}
									description={
										<span>
											{existState.description}
											<br />
											{existState.department}
											<br />
											{existState.section}
										</span>
									}
								/>
							</Col>
						)}
						<Col
							offset={existState.message ? 4 : 12}
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
							? PlanDetails(planDetails).map((item, index) => (
									<Col style={{ textAlign: item.textAlign }} span={8} key={index}>
										<Input
											readOnly
											value={item.value}
											addonBefore={item.title}
											style={{ width: item.width }}
										/>
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
												style={{ marginBottom: '20px' }}>
												<TextArea
													autoSize
													value={planDetails.logs}
													onChange={(value, event) =>
														handleEvent(value, 'logs')
													}></TextArea>
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={[16, 16]}>
										<Col span={8}>
											<Form.Item
												name={`Henkou Type`}
												label={`Henkou Type`}
												style={{ marginBottom: '20px' }}>
												<Select
													style={{ width: 150 }}
													onChange={(value, event) =>
														handleEvent(value, 'type_id')
													}>
													{types.map((item) => {
														return (
															<Option value={item.id} key={item.id}>
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
													{reasons.map((item) => {
														return (
															<Option value={item.id} key={item.id}>
																{item.reason_name}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												name={`Departments`}
												label={`Departments`}
												style={{
													marginBottom: '0px'
												}}>
												<Select
													disabled={!existState.showDepartments}
													style={{ width: 200 }}
													onChange={(value, event) =>
														handleEvent(value, 'department_id')
													}>
													{departments.map((item, index) => {
														return (
															<Option
																value={item.DepartmentCode}
																key={item.DepartmentCode}>
																{item.DepartmentName}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<Button
												type="primary"
												onClick={() => {
													// window.open(
													// 	'http://10.169.141.101:3000/storage/HenkouForm.xls'
													// );
													generateHenkouForm();
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
												onClick={() => {
													resetData();
												}}>
												Clear
											</Button>

											<Button
												style={{ margin: '0 8px' }}
												type="primary"
												// htmlType="submit"
												onClick={() => handleRecheckModal()}>
												Re-check
											</Button>
											<Button
												type="primary"
												// htmlType="submit"
												onClick={() => handleRegisterAndUpload()}>
												Register
											</Button>
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
																			)} Registered By:${
																			stat?.employee
																				?.EmployeeName
																		}(${stat.rev_no}):   ${
																			stat.log
																		}`;
																	} else {
																		return `\n${moment
																			.utc(stat.created_at)
																			.format(
																				'YYYY-MM-DD, h:mm:ss a'
																			)}  ${
																			stat.product_name
																		}(${stat.rev_no}):   ${
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
													pending.actions.handlePendingModal(planDetails)
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
					className={'recheck-modal'}
					title={`Recheck`}
					onOk={handleRecheckOk}
					okText="Save"
					onCancel={handleRecheckCancel}
					width={650}
					visible={recheck.modalVisible}>
					<Table
						className={'recheck-table'}
						pagination={false}
						rowSelection={{
							selectedRowKeys: recheck.selectedRowKeys,
							onChange: onSelectChange,
							onSelect: onSelectRow
						}}
						rowKey={(record) => record.id}
						bordered
						columns={RecheckHeader}
						dataSource={recheck.products}
						size="small"
					/>
				</Modal>
				<Modal
					title={`Pending ${pending?.state.row?.affected_product?.product_category?.product_name}`}
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
							rest.user,
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
	user: state.auth.user
});
export default connect(mapStateToProps)(ManualContainer);
