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

const { Search, TextArea } = Input;
const { Title } = Typography;
const HenkouContainer = (props) => {
	const {
		details,
		product,
		handleEvent,
		handleUpdate,
		assessment,
		status,
		company,
		...rest
	} = props;
	const [expand, setExpand] = useState(false);
	const [row, setRow] = useState({});
	const [isVisibleAttachmentModal, setVisibleAttachmentModal] = useState(false);
	const [attachments, setAttachments] = useState([]);
	const [pendingItems, setPendingItems] = useState([]);
	const [isVisiblePendingModal, setVisiblePendingModal] = useState(false);
	const [form] = Form.useForm();
	/* HENKOU PROCESS */

	const checkIfSupplier = (record) => {
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

	const handleStatus = (row, key, isPendingItems = null) => {
		row[key] = moment().format('YYYY-MM-DD HH:mm:ss');
		if (isPendingItems) {
			if (key == 'start') {
				row.isItemStarted = true;
			}
			if (key == 'resume') {
				// const diff_seconds = moment(row.start).diff(row.resume, 'seconds');
				const ms = moment(row.resume, 'YYYY-MM-DD HH:mm:ss').diff(
					moment(row.start, 'YYYY-MM-DD HH:mm:ss')
				);
				const d = moment.duration(ms);

				row.duration = isNaN(moment(row.start).diff(row.resume))
					? ''
					: d.days() + ':' + d.hours() + ':' + d.minutes() + ':' + d.seconds();
			}
			pendingItems[row.index - 1] = row;
			const clonePendingItems = [...pendingItems];
			setPendingItems(clonePendingItems);
		} else {
			console.log('ops');
			if (key == 'finished_date') {
				row.received_date = moment().format('YYYY-MM-DD HH:mm:ss');
			}
			if (key == 'start_date') {
				row.toggleStatus = false;
			}
			handleUpdate(row, details, key);
		}
	};
	const handleAssessment = (value, key, row) => {
		row[key] = value;
		console.log(row);
		if (value !== 3) {
			row.toggleSelect = false;
		} else {
			row.toggleSelect = true;
		}
		handleUpdate(row, details, key);
		// handleUpdate;
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
		console.log('onEnter');
		const result = await handleEvent(e.target.value);
		result == 'found' ? setExpand(true) : (setExpand(false), openNotificationWithIcon('info'));
	};
	/*  */
	/* PENDING MODAL */
	const handlePending = async (record) => {
		const pendingResource = await Http.get(`/api/henkou/pending/${record.id}`);
		if (pendingResource.data.length <= 0) {
			let pending = [];
			for (let i = 0; i < 1; i++) {
				pending.push({
					index: i + 1,
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
		} else {
			setPendingItems(
				pendingResource.data.map((item, index) => {
					return {
						index: index + 1,
						start: item.start_date,
						resume: item.resume_date,
						duration: '',
						...item,
						id: item.status_id
					};
				})
			);
		}
		setRow(record);

		setVisiblePendingModal(true);
	};

	const handleOk = async () => {
		const filteredPendingItems = pendingItems.filter((item) => {
			return item.start || item.resume || item.reason;
		});
		// .map(item=> {
		//     return {
		//         id
		//         product_key
		//         rev_no
		//         start_date
		//         reason
		//         resume_date
		//         duration
		//         status_id
		//     }
		// })
		if (filteredPendingItems.length > 0) {
			const response = await Http.post('/api/henkou/pending', filteredPendingItems);
			console.log(response);
		}
		setVisiblePendingModal(false);
		setPendingItems([]);
		setRow({});
	};

	const handleCancel = () => {
		setVisiblePendingModal(false);
		setPendingItems([]);
		setRow({});
	};

	const addPendingItems = (row, key) => {
		console.log(row);
		pendingItems.push({
			index: pendingItems.length + 1,
			rev_no: details.rev_no,
			start: '',
			reason: '',
			resume: '',
			duration: '',
			product_key: row.ProductCode,
			...row
		});
		let cloneItems = [...pendingItems];
		setPendingItems(cloneItems);
	};
	const handleReasonInput = (row, e) => {
		row.reason = e.target.value;
		pendingItems[row.index - 1] = row;
		const clonePendingItems = [...pendingItems];
		setPendingItems(clonePendingItems);
	};
	/* PENDING MODAL */
	/* ATTACHMENT MODAL */
	const attachmentModalOk = () => {
		setVisibleAttachmentModal(false);
	};
	const attachmentModalCancel = () => {
		setVisibleAttachmentModal(false);
	};
	const handleAttachmentModal = async () => {
		const responseLists = await Http.get(`/api/henkou/attachments/${details.id}`);
		setAttachments(responseLists.data);
		setVisibleAttachmentModal(true);
	};
	/* ATTACHMENT MODAL */

	return (
		<>
			<Form
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={onFinish}>
				<Row gutter={[10, 10]}>
					<Col span={12}>
						<Search
							placeholder="Enter Code"
							allowClear
							addonBefore="Customer Code"
							onPressEnter={onEnter}
							style={{ width: 300, margin: '0 0' }}></Search>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
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
							<Col style={{ textAlign: item.textAlign }} span={12} key={index}>
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
							<TextArea value={details ? details.logs : ''} rows={5}></TextArea>
						) : (
							<></>
						)}
					</Col>

					<Col span={24} style={{ textAlign: 'right' }}>
						<a
							style={{ fontSize: 12 }}
							onClick={() => {
								setExpand(!expand);
							}}>
							{expand ? <UpOutlined /> : <DownOutlined />} See Details
						</a>
					</Col>
				</Row>
			</Form>
			<Modal
				title="Attachments"
				onOk={attachmentModalOk}
				onCancel={attachmentModalCancel}
				bodyStyle={{ padding: 0 }}
				visible={isVisibleAttachmentModal}>
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
				onOk={handleOk}
				okText="Save"
				onCancel={handleCancel}
				bodyStyle={{ padding: 10 }}
				width={650}
				visible={isVisiblePendingModal}>
				{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
				<Table
					rowKey={(record) => record.index}
					columns={PendingHeaders(handleStatus, handleReasonInput)}
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
			{expand ? (
				<div style={{ padding: 5 }}>
					<Title level={4} style={{ margin: 0 }}>
						Henkou Status
					</Title>
					<Table
						rowKey={(record) => record.id}
						columns={henkouStatusHeader(
							assessment,
							handleStatus,
							handleAssessment,
							handlePending,
							checkIfSupplier
						)}
						bordered
						rowKey={(record) => record.id}
						dataSource={
							status.map((item) => {
								return {
									id: item.id,
									...item,
									logs: item.log ? item.log : item.logs,
									days_in_process: isNaN(
										moment(item.start_date).diff(item.finished_date)
									)
										? ''
										: moment(item.start_date).diff(item.finished_date, 'days')
								};
							})
							// .filter((item, index) => {
							// 	if (rest.userInfo.DesignationCode == '003') {
							// 		if (
							// 			rest.userInfo.DepartmentCode ==
							// 				product.find((el) => el.product_key == item.product_key)
							// 					.department_id &&
							// 			rest.userInfo.SectionCode ==
							// 				product.find((el) => el.product_key == item.product_key)
							// 					.section_id
							// 		) {
							// 			return item;
							// 		}
							// 	} else {
							// 		if (
							// 			rest.userInfo.DepartmentCode ==
							// 				product.find((el) => el.product_key == item.product_key)
							// 					.department_id &&
							// 			rest.userInfo.SectionCode ==
							// 				product.find((el) => el.product_key == item.product_key)
							// 					.section_id &&
							// 			rest.userInfo.TeamCode ==
							// 				product.find((el) => el.product_key == item.product_key)
							// 					.team_id
							// 		) {
							// 			return item;
							// 		}
							// 	}
							// })
						}
						// dataSource={product.map((item, index) => {
						// 	if (index == '0') {
						// 		if (item.ProductCategory == 'KAKOU IRAI') {
						// 			return {
						// 				toggleStatus: true,
						// 				toggleSelect: true,
						// 				...item,
						// 				id: status[index].id,
						// 				department:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return (
						// 									attr.DepartmentCode ==
						// 									item.department_id
						// 								);
						// 						  }).DepartmentName
						// 						: null,
						// 				section:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return attr.SectionCode == item.section_id;
						// 						  }).SectionName
						// 						: null,
						// 				team:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return attr.TeamCode == item.team_id;
						// 						  }).TeamName
						// 						: null,
						// 				sequence:
						// 					details.method == '2'
						// 						? item.waku_sequence
						// 						: item.jiku_sequence,
						// 				received_date:
						// 					status.length > 0 ? status[index].received_date : null,
						// 				start_date:
						// 					status.length > 0 ? status[index].start_date : null,
						// 				finish_date:
						// 					status.length > 0 ? status[index].finished_date : null,
						// 				assessment_id:
						// 					status.length > 0 ? status[index].assessment_id : null,

						// 				logs: details ? details.logs : '',
						// 				days_in_process: isNaN(
						// 					moment(status[index].start_date).diff(
						// 						status[index].finished_date,
						// 						'days'
						// 					)
						// 				)
						// 					? ''
						// 					: moment(status[index].start_date).diff(
						// 							status[index].finished_date,
						// 							'days'
						// 					  )
						// 			};
						// 		} else {
						// 			return {
						// 				toggleStatus: true,
						// 				toggleSelect: true,
						// 				...item,
						// 				id: status[index].id,
						// 				department:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return (
						// 									attr.DepartmentCode ==
						// 									item.department_id
						// 								);
						// 						  }).DepartmentName
						// 						: null,
						// 				section:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return attr.SectionCode == item.section_id;
						// 						  }).SectionName
						// 						: null,
						// 				team:
						// 					company.length > 0
						// 						? company.find((attr) => {
						// 								return attr.TeamCode == item.team_id;
						// 						  }).TeamName
						// 						: null,
						// 				sequence:
						// 					details.method == '2'
						// 						? item.waku_sequence
						// 						: item.jiku_sequence,
						// 				received_date:
						// 					status.length > 0 ? status[index].received_date : null,
						// 				start_date:
						// 					status.length > 0 ? status[index].start_date : null,
						// 				finish_date:
						// 					status.length > 0 ? status[index].finished_date : null,
						// 				assessment_id:
						// 					status.length > 0 ? status[index].assessment_id : null,
						// 				days_in_process: isNaN(
						// 					moment(status[index].start_date).diff(
						// 						status[index].finished_date,
						// 						'days'
						// 					)
						// 				)
						// 					? ''
						// 					: moment(status[index].start_date).diff(
						// 							status[index].finished_date,
						// 							'days'
						// 					  )
						// 			};
						// 		}
						// 	} else {
						// 		return {
						// 			toggleStatus: true,
						// 			toggleSelect: true,
						// 			...item,
						// 			id: status[index].id,
						// 			department:
						// 				company.length > 0
						// 					? company.find((attr) => {
						// 							return (
						// 								attr.DepartmentCode == item.department_id
						// 							);
						// 					  }).DepartmentName
						// 					: null,
						// 			section:
						// 				company.length > 0
						// 					? company.find((attr) => {
						// 							return attr.SectionCode == item.section_id;
						// 					  }).SectionName
						// 					: null,
						// 			team:
						// 				company.length > 0
						// 					? company.find((attr) => {
						// 							return attr.TeamCode == item.team_id;
						// 					  }).TeamName
						// 					: null,
						// 			sequence:
						// 				details.method == '2'
						// 					? item.waku_sequence
						// 					: item.jiku_sequence,
						// 			received_date:
						// 				status.length > 0 ? status[index].received_date : null,
						// 			start_date: status.length > 0 ? status[index].start_date : null,
						// 			finish_date:
						// 				status.length > 0 ? status[index].finished_date : null,
						// 			assessment_id:
						// 				status.length > 0 ? status[index].assessment_id : null,
						// 			days_in_process: isNaN(
						// 				moment(status[index].start_date).diff(
						// 					status[index].finished_date,
						// 					'days'
						// 				)
						// 			)
						// 				? ''
						// 				: moment(status[index].start_date).diff(
						// 						status[index].finished_date,
						// 						'days'
						// 				  )
						// 		};
						// 	}
						// })}
						scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
					/>
					{/* <HenkouTable
						headers={henkouStatusHeader(
							assessment,
							handleStatus,
							handleAssessment,
							handlePending
						)}
						data={plandetail.map((item, index) => {
							if (index == '0') {
								if (item.ProductCategory == 'KAKOU IRAI') {
									return {
										id: index + 1,
										toggleStatus: true,
										toggleSelect: true,
										...item,
										received_date:
											status.length > 0 ? status[index].received_date : null,
										start_date:
											status.length > 0 ? status[index].start_date : null,
										finish_date:
											status.length > 0 ? status[index].finished_date : null,
										assessment_id:
											status.length > 0 ? status[index].assessment_id : null,

										logs: details ? details.logs : '',

									};
								} else {
									return {
										id: index + 1,
										toggleStatus: true,
										toggleSelect: true,
										...item,
										received_date:
											status.length > 0 ? status[index].received_date : null,
										start_date:
											status.length > 0 ? status[index].start_date : null,
										finish_date:
											status.length > 0 ? status[index].finished_date : null,
										assessment_id:
											status.length > 0 ? status[index].assessment_id : null,
										days_in_process: isNaN(
											moment(status[index].start_date).diff(
												status[index].finished_date
											)
										)
											? ''
											: moment(status[index].start_date).diff(
													status[index].finished_date
											  )
									};
								}
							} else {
								return {
									id: index + 1,
									toggleStatus: true,
									toggleSelect: true,
									...item,
									received_date:
										status.length > 0 ? status[index].received_date : null,
									start_date: status.length > 0 ? status[index].start_date : null,
									finish_date:
										status.length > 0 ? status[index].finished_date : null,
									assessment_id:
										status.length > 0 ? status[index].assessment_id : null,
									days_in_process: isNaN(
										moment(status[index].start_date).diff(
											status[index].finished_date
										)
									)
										? ''
										: moment(status[index].start_date).diff(
												status[index].finished_date
										  )
								};
							}
						})}
					/> */}
				</div>
			) : (
				''
			)}
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(HenkouContainer);
