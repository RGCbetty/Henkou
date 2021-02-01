import React, { useState, useEffect } from 'react';
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
	message
} from 'antd';
import { DownOutlined, UpOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import HenkouTable from '../HenkouTable';

import { planStatusHeaders } from '../RegistrationComponents/PlanStatus(PCMS)Header';
import headers from '../RegistrationComponents/HenkouStatusHeader';
import PlanDetails from '../RegistrationComponents/PlanDetails';

import moment from 'moment';
import Http from '../../Http';

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Title } = Typography;
const ManualContainer = ({
	handleSpecs,
	details,
	henkouInfo,
	handleOnChange,
	handleRegister,
	status,
	planStatusPCMS
}) => {
	const { types, reasons, products } = henkouInfo;
	const [visible, setVisible] = useState(false);
	const [expand, setExpand] = useState(false);
	const [upload, setUpload] = useState({
		fileList: [],
		status: false
	});
	const [checkPlanStatus, setCheckPlanStatus] = useState(false);
	const [form] = Form.useForm();
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};
	const handleEvent = async (value, keys = null) => {
		if (!keys) {
			const e = value;
			await handleSpecs(e.target.value);
			setExpand(true);
		} else {
			handleOnChange(value, keys);
		}
	};
	const handleUpload = async (details) => {
		console.log('this is upload');
		const { fileList } = upload;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('files[]', file);
		});

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
					<Col span={16} style={{ textAlign: 'right' }}>
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
						<Col span={8}>
							<Upload {...uploadProps}>
								<Button type="primary" icon={<UploadOutlined />} htmlType="button">
									Upload
								</Button>
							</Upload>
						</Col>
						<Col span={16} style={{ textAlign: 'right' }}>
							<Button
								type="primary"
								htmlType="button"
								onClick={() => (setVisible(true), setCheckPlanStatus(true))}>
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
								<HenkouTable
									headers={planStatusHeaders}
									data={planStatusPCMS.map((item, index) => {
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
				<a
					style={{ fontSize: 12, textAlign: 'right' }}
					onClick={() => {
						setExpand(!expand);
					}}>
					{expand ? <UpOutlined /> : <DownOutlined />} Collapse
				</a>
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
			{details.existing_rev_no || checkPlanStatus ? (
				<div style={{ padding: 5 }}>
					<Title level={4} style={{ margin: 0 }}>
						Henkou Status
					</Title>
					<HenkouTable
						headers={headers}
						data={planStatusPCMS.map((item, index) => {
							if (index == '0') {
								if (item.ProductCategory == 'KAKOU IRAI') {
									return {
										id: index + 1,
										...item,
										received_date:
											status.length > 0 ? status[index].received_date : null,

										start_date:
											status.length > 0 ? status[index].start_date : null,
										finish_date:
											status.length > 0 ? status[index].finished_date : null,
										assessment:
											status.length > 0 ? status[index].assessment_id : null,
										logs: details.logs
									};
								} else {
									return {
										id: index + 1,
										...item,
										received_date:
											status.length > 0 ? status[index].received_date : null,
										start_date:
											status.length > 0 ? status[index].start_date : null,
										finish_date:
											status.length > 0 ? status[index].finished_date : null,
										assessment:
											status.length > 0 ? status[index].assessment_id : null
									};
								}
							} else {
								return {
									id: index + 1,
									...item,
									start_date: status.length > 0 ? status[index].start_date : null,
									finish_date:
										status.length > 0 ? status[index].finished_date : null,
									assessment:
										status.length > 0 ? status[index].assessment_id : null,
									received_date:
										status.length > 0 ? status[index].received_date : null
								};
							}
						})}
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
							onClick={() => (handleRegister(details), handleUpload(details))}>
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

export default ManualContainer;
