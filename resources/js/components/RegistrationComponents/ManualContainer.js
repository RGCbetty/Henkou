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
	Table
} from 'antd';
import { DownOutlined, UpOutlined, UploadOutlined, SnippetsOutlined } from '@ant-design/icons';

import { planStatusHeaders } from '../RegistrationComponents/PlanStatus(PCMS)Header';
import headers from '../RegistrationComponents/HenkouStatusHeader';
import PlanDetails from '../RegistrationComponents/PlanDetails';

import moment from 'moment';
import Http from '../../Http';
import { useActivePlanStatus } from '../../api/planstatus';

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Title } = Typography;
const ManualContainer = ({
	product,
	handleSpecs,
	details,
	henkouInfo,
	handleOnChange,
	handleRegister,
	status,
	...rest
}) => {
	const { types, reasons, products } = henkouInfo;
	/* PCMS */
	const [assignedProductCategoriesPCMS, setPlanDetail] = useState([]);
	const [productCategoriesPCMS, setProductCategoriesPCMS] = useActivePlanStatus();
	const [userProductCategoriesPCMS, setUserProducts] = useState([]);
	const [subProductPCMS, setSubProduct] = useState(false);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	/* PCMS */
	const [henkouLoading, setHenkouLoading] = useState(false);
	const [expand, setExpand] = useState(false);
	const [showCollapse, setShowCollapse] = useState(false);
	const [upload, setUpload] = useState({
		fileList: [],
		status: false
	});
	const [checkPlanStatus, setCheckPlanStatus] = useState(false);
	const [form] = Form.useForm();
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};
	const onClickPlanStatusBtn = async () => {
		setVisible(true);
		setCheckPlanStatus(true);
		setLoading(true);
		const instance = Http.create({
			baseURL: 'http://hrdapps71:4900/',
			withCredentials: false,
			headers: {
				'master-api': 'db588403f0a1d3b897442a28724166b4'
			}
		});
		/* PCMS */
		let checkedPlanDetails = {};
		let email = null;
		let tempStat = '';
		let arr = [];
		let temp = {};
		let planDetails = [];
		let pending = '';
		const responseCheckPlans = await instance.get(`get/checkPlan/${details.customer_code}`);
		console.log(responseCheckPlans);
		if (responseCheckPlans.data.length > 0) {
			if (responseCheckPlans.data[0].EmailedDate) {
				email = responseCheckPlans.data[0].EmailedDate;
			}
			checkedPlanDetails = {
				KakouIraiRequest: responseCheckPlans.data[0].KakouIraiRequest,
				HouseTypeCode: responseCheckPlans.data[0].HouseTypeCode,
				HouseClass: responseCheckPlans.data[0].HouseClass,
				EmailedDate: email,
				JoutouDate: responseCheckPlans.data[0].JoutouDate,
				ShiageDelivery: responseCheckPlans.data[0].ShiageDelivery,
				KisoStart: responseCheckPlans.data[0].KisoStart
			};
		} else {
			checkedPlanDetails = {
				HouseClass: details.method == 1 ? 'Jikugumi' : 'Wakugumi'
			};
		}
		const responsePlanStatus = await instance.get(
			`get/viewPlanStatus/${details.customer_code}`
		);
		for (let i = 0; i < productCategoriesPCMS.length; i++) {
			if (
				checkedPlanDetails.HouseClass == productCategoriesPCMS[i].HouseType ||
				productCategoriesPCMS[i].HouseType == 'Both'
			) {
				let rems = false;
				if (
					_.includes(
						_.map(responsePlanStatus.data, 'Product'),
						productCategoriesPCMS[i]._id
					)
				) {
					let a = _.find(responsePlanStatus.data, [
						'Product',
						productCategoriesPCMS[i]._id
					]);
					if (a.Status == 'Received') {
						tempStat = 'Not Yet Started';
					} else {
						tempStat = a.Status;
						if (tempStat == 'Pending') {
							rems = true;
						}
						if (a.Process != undefined) {
							a.Process.forEach((val) => {
								if (val.Remarks != undefined) {
									if (val.Remarks) {
										rems = true;
									}
								}
								if (val.Pending != undefined && val.Pending.length > 0) {
									pending = val.Pending.map((arr) => {
										if (arr.PendingResume == null) {
											return arr;
										}
									});
								}
							});
						} else {
							if (a.Remarks != undefined) {
								if (a.Remarks) {
									rems = true;
								}
							}
							if (a.Pending != undefined) {
								pending = a.Pending;
							}
						}
						if (a.LeadersRemarks != undefined) {
							if (a.LeadersRemarks) {
								rems = true;
							}
						} else {
							if (a.LeadersRemarksHistory && a.LeadersRemarksHistory.length > 0) {
								rems = true;
							}
						}
						if (productCategoriesPCMS[i]._id != 'aPi@wUk3D') {
							arr.push({
								ProductCode: productCategoriesPCMS[i]._id,
								ProductCategory: productCategoriesPCMS[i].ProductCategory,
								ProductType: productCategoriesPCMS[i].ProductType,
								Department: productCategoriesPCMS[i].Department,
								Section:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Section
										: null,
								Team:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Team
										: null,
								Sequence: parseInt(
									productCategoriesPCMS[i].ProductSequence[
										checkedPlanDetails.HouseClass
									]
								),
								Status: tempStat,
								FinishDate: a.FinishDate,
								ReceiveDate: a.ReceiveDate,
								Remarks: rems,
								Pending: pending
							});
						} else {
							if (a.ReKakouIrai != undefined && a.Status == 'Received') {
								tempStat = 'Finished';
							}
							temp = {
								ProductCode: productCategoriesPCMS[i]._id,
								ProductCategory: productCategoriesPCMS[i].ProductCategory,
								ProductType: productCategoriesPCMS[i].ProductType,
								Department: productCategoriesPCMS[i].Department,
								Section:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Section
										: null,
								Team:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Team
										: null,
								Sequence: parseInt(
									productCategoriesPCMS[i].ProductSequence[
										checkedPlanDetails.HouseClass
									]
								),
								Status: tempStat,
								FinishDate: a.FinishDate,
								ReceiveDate: a.ReceiveDate,
								Remarks: rems,
								Pending: pending
							};
						}
					}
				} else {
					arr.push({
						ProductCode: productCategoriesPCMS[i]._id,
						ProductCategory: productCategoriesPCMS[i].ProductCategory,
						ProductType: productCategoriesPCMS[i].ProductType,
						Department: productCategoriesPCMS[i].Department,
						Section:
							productCategoriesPCMS[i].Res.length > 0
								? productCategoriesPCMS[i].Res[0].Section
								: null,
						Team:
							productCategoriesPCMS[i].Res.length > 0
								? productCategoriesPCMS[i].Res[0].Team
								: null,
						Sequence: parseInt(
							productCategoriesPCMS[i].ProductSequence[checkedPlanDetails.HouseClass]
						),
						Status: 'Not Yet Receive',
						FinishDate: null,
						ReceiveDate: null,
						Remarks: rems,
						Pending: pending
					});
				}
			}
		}
		planDetails = _.sortBy(arr, ['Sequence', 'ProductCategory']);
		planDetails.unshift(temp);
		let userProducts = [];
		// setPlanStatus(planDetails);
		const responseEmployeeProducts = await instance.get(
			`get/getID/${rest.userInfo.EmployeeCode}`
		);
		console.log(responseEmployeeProducts, '00000001010101');
		if (responseEmployeeProducts != undefined && responseEmployeeProducts.data.length > 0) {
			// if (
			//     responseEmployeeProducts.data[0].filtering == true &&
			//     responseEmployeeProducts.data[0].filtering != undefined
			// ) {
			userProducts = responseEmployeeProducts.data[0][checkedPlanDetails.HouseClass]
				? responseEmployeeProducts.data[0][checkedPlanDetails.HouseClass]
				: responseEmployeeProducts.data[0].myProducts;
			setUserProducts(userProducts);
			// }
			if (
				responseEmployeeProducts.data[0].showSubProduct == true &&
				responseEmployeeProducts.data[0].showSubProduct != undefined
			) {
				const showSubProducts = responseEmployeeProducts.data[0].showSubProduct
					? responseEmployeeProducts.data[0].showSubProduct
					: false;
				setSubProduct(showSubProducts);
			}
		}

		/* PCMS */
		if (userProducts.length > 0) {
			const assignedProductCategoriesPCMS = planDetails.filter((item) => {
				return userProducts.includes(item.ProductCode);
			});
			console.log(assignedProductCategoriesPCMS, '@@@#$%^&*(');

			setPlanDetail(assignedProductCategoriesPCMS);
		}
		setLoading(false);
	};
	const openNotificationWithIcon = (type) => {
		notification[type]({
			message: 'Plan not yet registered!'
		});
	};
	const handleEvent = async (value, keys = null) => {
		setHenkouLoading(true);
		if (!keys) {
			const e = value;
			const result = await handleSpecs(e.target.value);
			result == 'found'
				? (setExpand(true), setShowCollapse(true))
				: (setExpand(false), openNotificationWithIcon('info'));
			// setExpand(true);
		} else {
			handleOnChange(value, keys);
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
				console.log(uploadResponse);
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
							onPressEnter={handleEvent}
							addonBefore="Customer Code"
							style={{ width: 300, margin: '0 0' }}></Search>
					</Col>
					<Col span={8} style={{ textAlign: 'center', padding: '10 0 0 0' }}>
						Registration Page
					</Col>
					<Col span={8} style={{ textAlign: 'right' }}>
						<DatePicker
							defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)}
							disabled
							format={dateFormat}
						/>
					</Col>

					{expand
						? PlanDetails(details).map((item, index) => (
								<Col style={{ textAlign: item.textAlign }} span={8} key={index}>
									<Form.Item
										style={{ marginBottom: '0px' }}
										rules={[
											{
												required: true,
												message: 'Input something!'
											}
										]}>
										<Input
											value={item.value}
											addonBefore={item.title}
											style={{ width: item.width }}
										/>
									</Form.Item>
								</Col>
						  ))
						: null}
				</Row>
				{expand ? (
					<Row gutter={[10, 10]}>
						<Col span={12}>
							<Button
								type="primary"
								onClick={() => {
									window.open('http://localhost:3000/storage/HenkouForm.xls');
								}}
								style={{ margin: '0 8px' }}
								icon={<SnippetsOutlined />}
								htmlType="button">
								Henkou Form
							</Button>
							<Upload {...uploadProps}>
								<Button type="primary" icon={<UploadOutlined />} htmlType="button">
									Upload
								</Button>
							</Upload>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<Button
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
							</Modal>
							<Button
								style={{ margin: '0 8px' }}
								onClick={() => {
									form.resetFields();
								}}>
								Clear
							</Button>
						</Col>
					</Row>
				) : null}
				{showCollapse ? (
					<a
						style={{ fontSize: 12, textAlign: 'right' }}
						onClick={() => {
							setExpand(!expand);
						}}>
						{expand ? <UpOutlined /> : <DownOutlined />} Collapse
					</a>
				) : null}
				<Row>
					{expand ? (
						<Col span={24} style={{ textAlign: 'center' }}>
							<Form.Item
								name={`Henkou Details`}
								label={`Henkou Details`}
								style={{ marginBottom: '0px' }}>
								<TextArea
									rows={5}
									value={details.logs}
									onChange={(value, event) =>
										handleEvent(value, 'logs')
									}></TextArea>
							</Form.Item>
						</Col>
					) : (
						<></>
					)}
					{expand ? (
						<>
							<Col span={11} style={{ textAlign: 'right', marginTop: 10 }}>
								<Input
									addonBefore="Existing Rev No."
									value={details.existing_rev_no}
									style={{ width: 200 }}></Input>
								<br />
								<Input
									addonBefore="Revision Number"
									value={details.rev_no}
									style={{ width: 200, marginTop: 10 }}></Input>
							</Col>
							<Col span={12} offset={1} style={{ textAlign: 'left', marginTop: 10 }}>
								<Form.Item
									name={`Henkou Type`}
									label={`Henkou Type`}
									style={{ marginBottom: '0px' }}>
									<Select
										style={{ width: 150 }}
										onChange={(value, event) => handleEvent(value, 'type_id')}>
										{types.map((item, index) => {
											return (
												<Option value={item.type_id} key={index}>
													{item.type_name}
												</Option>
											);
										})}
									</Select>
								</Form.Item>
								<Form.Item
									name={`Henkou Reason`}
									label={`Henkou Reason`}
									style={{ marginBottom: '0px', marginTop: 10 }}>
									<Select
										style={{ width: 160 }}
										onChange={(value, event) =>
											handleEvent(value, 'reason_id')
										}>
										{reasons.map((item, index) => {
											return (
												<Option value={item.reason_id} key={index}>
													{item.reason_name}
												</Option>
											);
										})}
									</Select>
								</Form.Item>
							</Col>
						</>
					) : null}
				</Row>
			</Form>
			{(details.existing_rev_no || checkPlanStatus) && status.length > 0 ? (
				<div style={{ padding: 5 }}>
					<Title level={4} style={{ margin: 0 }}>
						Henkou Status
					</Title>
					<Table
						style={{ marginTop: 10 }}
						columns={headers}
						loading={henkouLoading}
						bordered
						rowKey={(record) => record.id}
						dataSource={status.map((item) => {
							return {
								id: item.id,
								...item
								// sequence:
								// 	details.method == '2'
								// 		? product.find((el) => el.product_key == item.product_key)
								// 				.waku_sequence
								// 		: product.find((el) => el.product_key == item.product_key)
								// 				.jiku_sequence,
								// product_name: product.find(
								// 	(el) => el.product_key == item.product_key
								// ).product_name
							};
						})}
						scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
					/>
				</div>
			) : (
				''
			)}
			{(details.existing_rev_no && checkPlanStatus) || checkPlanStatus ? (
				<Row>
					<Col span={24} style={{ textAlign: 'right' }}>
						<Button
							style={{ textAlign: 'right', margin: 5 }}
							type="primary"
							htmlType="submit"
							onClick={() => setVisible(true)}>
							Close
						</Button>
						<Button
							style={{ textAlign: 'right' }}
							type="primary"
							htmlType="submit"
							onClick={() => handleRegisterAndUpload(details)}>
							Save
						</Button>
					</Col>
				</Row>
			) : (
				''
			)}
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(ManualContainer);
