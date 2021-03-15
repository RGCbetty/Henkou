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
		suppliers,
		uniqueProducts,
		company,
		affectedProducts,
		...rest
	} = props;
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
	const checkIfSupplier = (record) => {
		if (
			record.department == rest.userInfo.DepartmentName &&
			record.section == rest.userInfo.SectionName &&
			record.team == rest.userInfo.TeamName
		) {
			if (
				suppliers.length > 0
					? suppliers.find(
							(item) => item.product_key == record.product_key && item.last_touch
					  )
						? suppliers.find((item) => item.product_key == record.product_key)
								.last_touch
						: false
					: false
			) {
				return false;
			} else {
				return true;
			}
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
				row.resume_date = row[key];
				row.duration = isNaN(moment(row.start).diff(row.resume))
					? ''
					: durationAsString(row.start, row.resume);
			}
			pendingItems[row.index - 1] = row;
			const clonePendingItems = [...pendingItems];
			console.log(clonePendingItems);
			setPendingItems(clonePendingItems);
		} else {
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
		const result = await handleEvent(e.target.value);
		result == 'found'
			? (setExpand(true), setShowCollapse(true))
			: (setExpand(false), openNotificationWithIcon('info'));
	};
	/*  */
	/* PENDING MODAL */
	const handlePending = async (record) => {
		console.log(record);
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
						pending_id: item.id,
						index: index + 1,
						start: item.start_date,
						resume: item.resume_date,
						...item,
						id: item.status_id
					};
				})
			);
		}
		setRow(record);

		setVisibilty({ ...isVisible, pendingModal: true });
	};

	const handlePendingOk = async () => {
		const filteredPendingItems = pendingItems.filter((item) => {
			return item.start || item.resume || item.reason;
		});
		console.log(filteredPendingItems, 'pendingOk');
		if (filteredPendingItems.length > 0) {
			const response = await Http.post('/api/henkou/pending', filteredPendingItems);
		}
		setVisibilty({ ...isVisible, pendingModal: false });
		setPendingItems([]);
		setRow({});
	};

	const handlePendingCancel = () => {
		setVisibilty({ ...isVisible, pendingModal: false });
		setPendingItems([]);
		setRow({});
	};

	const addPendingItems = (row, key) => {
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
		setRow(record);
		setVisibilty({ ...isVisible, actionModal: true });
	};

	const handleActionOk = async () => {
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
					<Col span={8} style={{ textAlign: 'center', padding: '10 0 0 0' }}>
						Henkou Page
					</Col>
					<Col span={8} style={{ textAlign: 'right' }}>
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
							<TextArea value={details ? details.logs : ''} rows={5}></TextArea>
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
					rowKey={(record) => record.index}
					columns={PendingHeaders(handleStatus, handleReasonInput)}
					dataSource={
						pendingItems
						//     .map((item) => {
						// 	return {
						// 		...item,
						// 		duration: isNaN(moment(item.start).diff(item.resume))
						// 			? ''
						// 			: durationAsString(item.start, item.resume)
						// 	};
						// })
					}
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
				width={650}
				visible={isVisible.actionModal}>
				{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
				<Table
					rowKey={(record) => record.index}
					columns={ActionHeaders(handleStatus, handleReasonInput)}
					dataSource={status
						.map((item) => {
							return {
								id: item.id,
								...item,
								logs: item.log ? item.log : item.logs,
								days_in_process: isNaN(
									moment(item.start_date).diff(item.finished_date)
								)
									? ''
									: durationAsString(item.start_date, item.finished_date)
							};
						})
						.filter((item) => item.product_name == row.product_name)}
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
							handleStatus,
							{ handleAction, handleAssessment, handlePending },
							checkIfSupplier,
							checkIfOwner
						)}
						bordered
						dataSource={status.map((item) => {
							return {
								id: item.id,
								...item,
								logs: item.log ? item.log : item.logs,
								days_in_process: isNaN(
									moment(item.start_date).diff(item.finished_date)
								)
									? ''
									: durationAsString(item.start_date, item.finished_date),
								product_key: affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? affectedProducts.find((el) => el.id == item.affected_id)
											.product_category_id
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
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(HenkouContainer);
