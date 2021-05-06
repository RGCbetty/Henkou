/* Utilities */
import React, { useEffect, useState, useRef } from 'react';
import Http from '../Http';
import { connect } from 'react-redux';
import moment from 'moment';
import { filter, isObject, toInteger } from 'lodash';
import durationAsString from '../utils/diffDate';

/* Component */
import PDFLists from '../components/RegistrationComponents/PDFLists';
import ManualContainer from '../components/RegistrationComponents/ManualContainer';
import { headers } from '../components/RegistrationComponents/THPlansHeader';
import withSearch from '../utils/withSearch.jsx';
/* Material Design */
import { Modal, notification, Table, Input, Space, Button, Skeleton, Empty } from 'antd';

/* API */
import { useThPlansRetriever } from '../api/TH';
// import { useActivePlanStatus, getPlanStatusByCustomerCode } from '../api/planstatus';
import { fetchDetails } from '../api/details';

const Registration = ({ props, ...rest }) => {
	const { getColumnSearchProps } = rest;
	const { userInfo, master, title } = props;
	const inputRef = useRef();
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const [tableState, setTable] = useThPlansRetriever(userInfo);
	const { plans, filterplans, pagination, loading } = tableState;
	/* PENDING */
	console.log(filterplans);
	const [pendingState, setPendingState] = useState({
		items: [],
		isPendingModalVisible: false,
		row: {}
	});
	const [options, setOptions] = useState([]);
	/* PENDING */

	const [henkouStatus, setStatus] = useState([]);
	const [logs, setLogs] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState({
		modal: false,
		foundsList: []
	});
	const [details, setDetails] = useState({
		customer_code: '',
		house_code: '',
		house_type: '',
		method: '',
		plan_no: '',
		floors: '',
		plan_specification: '',
		joutou_date: '',
		days_before_joutou: '',
		kiso_start: '',
		before_kiso_start: '',
		dodai_invoice: '',
		['1F_panel_invoice']: '',
		['1F_hari_invoice']: '',
		['1F_iq_invoice']: '',
		rev_no: '',
		type_id: '',
		reason_id: '',
		logs: '',
		department_id: '',
		section_id: '',
		team_id: '',
		updated_by: ''
	});
	const handleOk = () => {
		setIsModalVisible({ modal: false, foundsList: [] });
	};

	/*  */

	const handleCancel = () => {
		setIsModalVisible({ modal: false, foundsList: [] });
	};
	/*  */
	const handleClickPDF = async (e, record) => {
		try {
			e.preventDefault();
			const instance = Http.create({
				baseURL: 'http://hrdapps36:3100/',
				withCredentials: false,
				headers: {
					'master-api': 'db588403f0a1d3b897442a28724166b4'
				}
			});
			const { ConstructionCode, RequestAcceptedDate } = record;
			const response = await instance.get(
				`http://hrdapps36:3100/nodexjloc?searchDate=${moment(RequestAcceptedDate).format(
					'YYYY-MM-DD'
				)}&constructionCode=${ConstructionCode}&henkoutype=Japan`
			);
			let lists = [];
			for (let i = 0; i < response.data.length; i++) {
				if (response.data[i].length >= 1) {
					for (let j = 0; j < response.data[i].length; j++) {
						let data = response.data[i][j];
						lists.push(data);
					}
				}
			}
			if (lists.length == 1) {
				window.open(lists[0].path, '_blank');
			} else {
				setIsModalVisible({ modal: true, foundsList: lists });
			}
		} catch (error) {
			console.error(error);
		}
	};
	const handleTableChange = (page, filters, sorter, extra) => {
		setTable({
			...tableState,
			pagination: {
				...page,
				total: extra.currentDataSource,
				showTotal: (total) => `Total ${total} items`
			}
		});
	};
	const handleOnChange = async (value, keys = null) => {
		if (!keys) {
			const e = value;
			await handleSpecs(e.target.value);
			setExpand(true);
		} else {
			if (isObject(value)) {
				const e = value;
				setDetails({ ...details, [keys]: e.target.value });
			} else {
				setDetails({ ...details, [keys]: value });
			}
		}
	};
	const openNotificationWithIcon = (type) => {
		notification[type]({
			message: 'Successfully Saved!'
		});
	};
	const borrowNotification = (type) => {
		notification[type]({
			message: 'Borrow successfully!'
		});
	};
	const handleRegister = async (row = null) => {
		if (row) {
			const response = await Http.post('api/henkou/register/th', {
				details,
				row
			});

			if (response.status == 200) {
				openNotificationWithIcon('success');
			}
			// }
		} else {
			const response = await Http.post('api/henkou/register/kouzou', {
				details
			});

			if (response.status == 200) {
				openNotificationWithIcon('success');
			}
		}
	};
	const handleOnClickEvent = async (row, key = null) => {
		row[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
		row.employee_code = userInfo.EmployeeCode;
		const toUpdatePlans = plans
			.map((item, index) => {
				if (
					item.ConstructionCode == row.ConstructionCode &&
					item.RequestNo == row.RequestNo
				) {
					return row;
				}
				return item;
			})
			.filter((item) => !item.finished_date);
		setTable({
			...tableState,
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination
			}
		});
		if (key == 'finished_date') {
			row.daysinprocess = moment(row.start_date).diff(row.finished_date, 'days');
			await handleSpecs(row.ConstructionCode);
			await handleRegister(row);
		}
		const response = await Http.post('/api/th/plan', row);
	};
	const handleInputText = (event, key, row) => {
		row[key] = event.target.value;
		setDetails({ ...details, [key]: row[key] });
		const toUpdatePlans = plans.map((item, index) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setTable({
			...tableState,
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination
			}
		});
	};
	const handleSelectOption = async (val, key, row) => {
		row[key] = val;
		row.employee_code = userInfo.EmployeeCode;
		const toUpdatePlans = plans.map((item, index) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setTable({
			...tableState,
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination
			}
		});
		await handlePlanDetails(row.ConstructionCode, row.RequestNo);
		const response = await Http.post('/api/th/plan', row);
	};
	/* TH Actions */
	const handlePlanDetails = async (constructionCode, th_no = null) => {
		try {
			const instance = Http.create({
				baseURL: 'http://hrdapps68:8070/api',
				withCredentials: false
			});
			const { data: plan, status } = await Http.get(`/api/plandetails/${constructionCode}`);
			const [firstDigit, secondDigit] = plan.latest ? plan.latest.rev_no.split('-') : '';
			const planstatus = await instance.get(
				`pcms/planstatus/${constructionCode}/${plan.details.method}`
			);
			// const { data: henkou } = await Http.get(`/api/details/${constructionCode}`);
			// let splitRevision = henkou ? henkou.rev_no.split('-') : '';
			// let secondaryRevision = toInteger(splitRevision[1]);
			if (status == 200) {
				console.log(details);
				setDetails((prevState) => {
					return {
						...prevState,
						customer_code: constructionCode,
						house_code: plan.details.house_code,
						house_type: plan.details.house_type,
						method: plan.details.method,
						plan_no: plan.details.plan_no,
						floors: plan.details.floors,
						joutou_date: plan.details.joutou_date,
						days_before_joutou: plan.details.days_before_joutou,
						kiso_start: plan.details.kiso_start,
						before_kiso_start: plan.details.before_kiso_start,
						dodai_invoice:
							plan.invoice.length > 0
								? plan.invoice.find((item) => item.InvoiceName.match(/DODAI/gi))
									? plan.invoice.find((item) => item.InvoiceName.match(/DODAI/gi))
											.Invoice
									: null
								: null,
						['1F_panel_invoice']:
							plan.invoice.length > 0
								? plan.invoice.find((item) => item.InvoiceName.match(/PANEL/gi))
									? plan.invoice.find((item) => item.InvoiceName.match(/PANEL/gi))
											.Invoice
									: null
								: null,
						['1F_hari_invoice']:
							plan.invoice.length > 0
								? plan.invoice.find((item) => item.InvoiceName.match(/HARI/gi))
									? plan.invoice.find((item) => item.InvoiceName.match(/HARI/gi))
											.Invoice
									: null
								: null,
						['1F_iq_invoice']:
							plan.invoice.length > 0
								? plan.invoice.find((item) => item.InvoiceName.match(/IQ/gi))
									? plan.invoice.find((item) => item.InvoiceName.match(/IQ/gi))
											.Invoice
									: null
								: null,
						plan_specification: plan.specification
							.map((item) => item.SpecificationName)
							.join(', '),
						existing_rev_no: plan.latest ? plan.latest.rev_no : null,
						rev_no: plan.latest ? `${firstDigit}-${toInteger(secondDigit) + 1}` : '1-0',
						type_id: '',
						reason_id: '',
						logs: '',
						plan_status: master.planstatus.find(
							(plan) => plan.id == planstatus.data.plan_status
						).plan_status_name,
						plan_status_id: planstatus.data.plan_status,
						th_no: th_no ? th_no : null,
						department_id: '',
						section_id: userInfo.SectionCode,
						team_id: userInfo.TeamCode,
						updated_by: userInfo.EmployeeCode
					};
				});
				return plan;
			}
		} catch (err) {
			console.error(err);
		}
	};
	const consolidatedHenkouLogs = async (planDetails) => {
		const [firstDigit, secondDigit] = planDetails ? planDetails.rev_no.split('-') : '';
		// const [firstIndex] = planDetails.rev_no.split('-');
		const fetchConsolidatedLogs = await Http.get(
			`api/henkou/plans/${planDetails.customer_code}/revision/${firstDigit}`
		);
		const fetchConsolidatedPendingDetails = await Http.get(
			`/api/henkou/plans/pending/${planDetails.customer_code}`
		);
		const productLogs = fetchConsolidatedLogs.data.map((item) => {
			return {
				...item,
				rev_no: item.details ? item.details.rev_no : null,
				product_name:
					master.products.length > 0
						? master.products.find((el) => {
								const affectedProds = master.affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? master.affectedProducts.find(
											(el) => el.id == item.affected_id
									  ).product_category_id
									: null;
								return affectedProds ? el.id == affectedProds : null;
						  })
							? master.products.find((el) => {
									const affectedProds = master.affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? master.affectedProducts.find(
												(el) => el.id == item.affected_id
										  ).product_category_id
										: null;
									return affectedProds ? el.id == affectedProds : null;
							  }).product_name
							: null
						: null
			};
		});
		const productPendingLogs = fetchConsolidatedPendingDetails.data.map((item) => {
			return {
				...item,
				product_name:
					master.products.length > 0
						? master.products.find((el) => {
								const affectedProds = master.affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? master.affectedProducts.find(
											(el) => el.id == item.affected_id
									  ).product_category_id
									: null;
								return affectedProds ? el.id == affectedProds : null;
						  })
							? master.products.find((el) => {
									const affectedProds = master.affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? master.affectedProducts.find(
												(el) => el.id == item.affected_id
										  ).product_category_id
										: null;
									return affectedProds ? el.id == affectedProds : null;
							  }).product_name
							: null
						: null
			};
		});
		const henkouLogs = [
			{
				log: details.logs,
				updated_by: details.updated_by,
				created_at: details.created_at,
				rev_no: details.rev_no
			},
			...productLogs
		];
		const mergeLogs = [...productLogs, ...productPendingLogs];
		setLogs(
			henkouLogs
				.map((item) => {
					return {
						id: item.id,
						borrow_details: item.borrow_details,
						rev_no: item.rev_no,
						product_name: item.product_name,
						updated_by: item.updated_by,
						log: item.log,
						created_at: item.created_at
					};
				})
				.sort((a, b) => moment(a.created_at).diff(b.created_at))
		);
	};
	const handleSpecs = async (constructionCode, th_no = null) => {
		try {
			const plan = await handlePlanDetails(constructionCode);
			if (plan.latest) {
				const fetchStatus = await Http.get(
					`/api/henkou/plans/${plan.latest.customer_code}/products/${plan.latest.id}`
				);
				await consolidatedHenkouLogs(plan.latest);
				setStatus(fetchStatus.data);
				const stats = fetchStatus.data.find(
					(el) =>
						(!el.assessment_id || el.assessment_id == 1) &&
						(el.affected_id == 5 ||
							el.affected_id == 23 ||
							el.affected_id == 34 ||
							el.affected_id == 54) &&
						el.received_date &&
						el.start_date &&
						el.finished_date
				);
				setDetails((prevState) => {
					return {
						...prevState,
						rev_no: stats ? '2-0' : prevState.rev_no
					};
				});
				const onGoingProductRow =
					master.products.length > 0
						? master.products.find((mp) => {
								const affectedProds = master.affectedProducts.find((ap) => {
									const stats = fetchStatus.data.find(
										(el) =>
											(!el.assessment_id || el.assessment_id == 1) &&
											el.received_date &&
											el.start_date &&
											!el.finished_date
									)
										? fetchStatus.data.find(
												(el) =>
													(!el.assessment_id || el.assessment_id == 1) &&
													el.received_date &&
													el.start_date &&
													!el.finished_date
										  ).affected_id
										: null;
									return stats ? ap.id == stats : null;
								})
									? master.affectedProducts.find((ap) => {
											const stats = fetchStatus.data.find(
												(el) =>
													(!el.assessment_id || el.assessment_id == 1) &&
													el.received_date &&
													el.start_date &&
													!el.finished_date
											)
												? fetchStatus.data.find(
														(el) =>
															(!el.assessment_id ||
																el.assessment_id == 1) &&
															el.received_date &&
															el.start_date &&
															!el.finished_date
												  ).affected_id
												: null;
											return stats ? ap.id == stats : null;
									  }).product_category_id
									: null;
								return affectedProds ? mp.id == affectedProds : null;
						  })
						: null;

				const notYetStartedProductRow =
					master.products.length > 0
						? master.products.find((mp) => {
								const affectedProds = master.affectedProducts.find((ap) => {
									const stats = fetchStatus.data.find(
										(el) =>
											(!el.assessment_id || el.assessment_id == 1) &&
											el.received_date &&
											!el.start_date &&
											!el.finished_date
									)
										? fetchStatus.data.find(
												(el) =>
													(!el.assessment_id || el.assessment_id == 1) &&
													el.received_date &&
													!el.start_date &&
													!el.finished_date
										  ).affected_id
										: null;
									return stats ? ap.id == stats : null;
								})
									? master.affectedProducts.find(
											(ap) =>
												ap.id ==
												fetchStatus.data.find(
													(el) =>
														(!el.assessment_id ||
															el.assessment_id == 1) &&
														el.received_date &&
														!el.start_date &&
														!el.finished_date
												).affected_id
									  ).product_category_id
									: null;
								return affectedProds ? mp.id == affectedProds : null;
						  })
						: null;

				const affectedProds = master.affectedProducts.find((ap) => {
					const stats = fetchStatus.data.find(
						(el) =>
							(!el.assessment_id || el.assessment_id == 1) &&
							el.received_date &&
							el.start_date &&
							!el.finished_date
					)
						? fetchStatus.data.find(
								(el) =>
									(!el.assessment_id || el.assessment_id == 1) &&
									el.received_date &&
									el.start_date &&
									!el.finished_date
						  ).affected_id
						: null;
					return stats ? ap.id == stats : null;
				});
				if (notYetStartedProductRow) {
					const affectedDepartment = master.departments.find((attr) => {
						return attr.DepartmentCode == notYetStartedProductRow.department_id;
					});
					console.log(affectedDepartment);
					return {
						status: 'notyetstarted',
						msg: notYetStartedProductRow.product_name,
						dept: affectedDepartment.DepartmentName
					};
				} else if (onGoingProductRow) {
					const pendingResource = await Http.get(
						`api/henkou/plans/pending/${plan.latest.customer_code}/${affectedProds.id}`
					);
					if (pendingResource.data.length == 0) {
						if (pendingState.items.length == 0) {
							let pending = [];
							for (let i = 0; i < 1; i++) {
								pending.push({
									pending_id: null,
									pending_index: i + 1,
									rev_no: plan.latest.rev_no,
									start: '',
									reason: '',
									resume: '',
									duration: '',
									product_key: master.affectedProducts.find(
										(ap) =>
											ap.id ==
											fetchStatus.data.find(
												(el) =>
													(!el.assessment_id || el.assessment_id == 1) &&
													el.received_date &&
													!el.finished_date
											).affected_id
									).product_category_id
								});
							}
							setPendingState({
								...pendingState,
								items: pending,
								row: { ...onGoingProductRow, affected_id: affectedProds.id }
							});
						}
					} else if (pendingState.items.length == 0) {
						setPendingState({
							...pendingState,
							row: { ...onGoingProductRow, affected_id: affectedProds.id },
							items: pendingResource.data.map((item, index) => {
								return {
									pending_id: item.id,
									pending_index: index + 1,
									start: item.start_date,
									resume: item.resume_date,
									...item,
									id: item.status_id
								};
							})
						});
					}
					const affectedDepartment = master.departments.find((attr) => {
						return attr.DepartmentCode == onGoingProductRow.department_id;
					});
					return {
						status: 'ongoing',
						msg: onGoingProductRow.product_name,
						dept: affectedDepartment.DepartmentName
					};
				}
			}
			return { status: 'found', msg: 'No existing henkou!' };
		} catch (error) {
			console.error(error);
		}
	};

	const clearDetails = () => {
		setDetails((prevState) => {
			return {
				customer_code: '',
				house_code: '',
				house_type: '',
				method: '',
				plan_no: '',
				floors: '',
				plan_specification: '',
				joutou_date: '',
				days_before_joutou: '',
				kiso_start: '',
				before_kiso_start: '',
				dodai_invoice: '',
				['1F_panel_invoice']: '',
				['1F_hari_invoice']: '',
				['1F_iq_invoice']: '',
				rev_no: '',
				type_id: '',
				reason_id: '',
				logs: '',
				department_id: '',
				section_id: '',
				team_id: '',
				updated_by: ''
			};
		});
	};
	const handlePendingModal = () => {
		setPendingState({
			...pendingState,
			isPendingModalVisible: true
		});
	};

	const handlePendingStatus = (record, key, isPendingItems = null) => {
		record[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
		if (isPendingItems) {
			if (key == 'start') {
				record.isItemStarted = true;
			}
			if (key == 'resume') {
				record.duration = isNaN(moment(record.start).diff(record.resume))
					? ''
					: durationAsString(record.start, record.resume);
			}
			pendingState.items[
				pendingState.items.findIndex((item) => item.pending_index == record.pending_index)
			] = record;
			const clonePendingItems = [...pendingState.items];
			setPendingState({
				...pendingState,
				items: clonePendingItems
			});
		}
	};
	const handleReasonInput = (record, key, e) => {
		record[key] = e.target.value;
		pendingState.items[
			pendingState.items.findIndex((item) => item.pending_index == record.pending_index)
		] = record;
		const clonePendingItems = [...pendingState.items];
		setPendingState({
			...pendingState,
			items: clonePendingItems
		});
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
		pendingState.items[
			pendingState.items.findIndex((item) => item.pending_index == record.pending_index)
		] = record;
		const clonePendingItems = [...pendingState.items];
		setPendingState({
			...pendingState,
			items: clonePendingItems
		});
	};
	const handlePendingOk = async () => {
		if (pendingState.items.length > 0) {
			if (
				pendingState.items.some(
					(row) => row.reason.match(/borrow form/gi) && !row.pending_id
				) ||
				pendingState.items.some((row) => row.reason.match(/borrow/gi) && !row.pending_id)
			) {
				const resCreate = await Http.post(`/api/status/${details.id}`, {
					status: henkouStatus,
					updated_by: userInfo.EmployeeCode,
					sectionCode: userInfo.SectionCode,
					details,
					row: pendingState.row
				});
				if (resCreate.status == 200) {
					borrowNotification('success');
				}
				const stats = henkouStatus.find(
					(el) =>
						(!el.assessment_id || el.assessment_id == 1) &&
						el.received_date &&
						el.start_date &&
						!el.finished_date
				)
					? henkouStatus.find(
							(el) =>
								(!el.assessment_id || el.assessment_id == 1) &&
								el.received_date &&
								el.start_date &&
								!el.finished_date
					  )
					: null;
				const filteredPendingItems = pendingState.items
					.filter((item) => {
						return item.start || item.resume || item.reason;
					})
					.map((item) => {
						return {
							...item,
							customer_code: details.customer_code,
							affected_id: pendingState.row.affected_id,
							id: stats.id
						};
					});

				if (filteredPendingItems.length > 0) {
					const response = await Http.post(
						'/api/henkou/plans/pending',
						filteredPendingItems
					);
				}
			}
		}

		setPendingState({
			...pendingState,
			isPendingModalVisible: false
		});
	};
	const handlePendingCancel = () => {
		const filterPendingItems = pendingState.items.filter((item) => item.pending_id);
		setPendingState({
			...pendingState,
			items: filterPendingItems,
			isPendingModalVisible: false
		});
	};
	const handleAddPendingItem = () => {
		function getMaxPendingID() {
			return pendingState.items.reduce(
				(max, obj) => (obj.pending_index > max ? obj.pending_index : max),
				pendingState.items[0].pending_index
			);
		}
		pendingState.items.push({
			pending_id: null,
			pending_index: getMaxPendingID() + 1,
			rev_no: details.rev_no,
			customer_code: details.customer_code,
			start: '',
			reason: '',
			resume: '',
			duration: ''
		});
		let cloneItems = [...pendingState.items];
		setPendingState({
			...pendingState,
			items: cloneItems
		});
	};
	return (
		<>
			{userInfo.SectionCode == '00465' && userInfo.TeamCode == '00133' ? (
				<>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div className="title-page">Register TH Plans</div>

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
								verticalAlign: 'right',
								margin: '10px 10px 10px 0px'

								// textAlign: 'right'
							}}>
							<Input.Search
								style={{ width: 300 }}
								placeholder="Enter Customer Code/House Code"
								allowClear
								onSearch={(nameSearch) =>
									setTable({
										...tableState,
										filterplans: nameSearch
											? plans.filter(
													(person) =>
														person.ConstructionCode.includes(
															nameSearch
														) ||
														person.NameCode.match(
															new RegExp(`${nameSearch}`, 'gi')
														)
											  )
											: [],
										pagination: {
											...pagination,
											total: nameSearch ? filterplans.length : plans.length
										}
									})
								}></Input.Search>
						</div>
					</div>

					<Table
						style={{ margin: '0 10px' }}
						size="small"
						columns={headers(
							getColumnSearchProps,
							master,
							handleClickPDF,
							handleSelectOption,
							handleOnClickEvent,
							handleInputText
						)}
						bordered
						locale={{
							emptyText: loading ? <Skeleton active={true} /> : <Empty />
						}}
						dataSource={loading ? [] : filterplans.length > 0 ? filterplans : plans}
						pagination={pagination}
						scroll={{ x: 'max-content', y: 'calc(100vh - 20em)' }}
						onChange={handleTableChange}
					/>
					<Modal
						title="PDF Lists"
						onOk={handleOk}
						onCancel={handleCancel}
						bodyStyle={{ padding: 0 }}
						visible={isModalVisible.modal}>
						<PDFLists pdfLists={isModalVisible.foundsList}></PDFLists>
					</Modal>
				</>
			) : (
				<>
					<ManualContainer
						handleClearDetails={clearDetails}
						handleSpecs={handleSpecs}
						handleOnChange={handleOnChange}
						handleRegister={handleRegister}
						logs={logs}
						status={henkouStatus}
						pending={{
							state: { ...pendingState, options },
							actions: {
								handlePendingStatus,
								handleReasonInput,
								onFocus,
								onSelect,
								handleAddPendingItem,
								handlePendingOk,
								handlePendingCancel,
								handlePendingModal
							}
						}}
						details={details}></ManualContainer>
				</>
			)}
		</>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});

export default connect(mapStateToProps)(withSearch(Registration));
