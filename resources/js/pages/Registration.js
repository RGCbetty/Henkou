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
import { headers, modalHeader } from '../components/RegistrationComponents/THPlansHeader';

import withSearch from '../utils/withSearch.jsx';
/* Material Design */
import { Modal, notification, Table, Input, Skeleton, Empty } from 'antd';

/* API */
import { useRegistrationState } from '../api/TH';
// import { useActivePlanStatus, getPlanStatusByCustomerCode } from '../api/planstatus';
import { fetchDetails } from '../api/details';
import planDetails from '../components/RegistrationComponents/PlanDetails';

const Registration = ({ props, ...rest }) => {
	const { getColumnSearchProps } = rest;
	const { user, title } = props;
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const [state, setState] = useRegistrationState(user);
	const {
		plans,
		filterplans,
		pagination,
		loading,
		thSelectedPlan,
		planDetails,
		products
	} = state;
	// useEffect(() => {
	// 	// if(){
	// 	const details = { ...state.planDetails };
	// 	// console.log(details);
	// 	// console.log(state);
	// 	// console.log(state);
	// 	setState((prevState) => {
	// 		// console.log(JSON.stringify(state.planDetails));
	// 		// console.log(JSON.stringify(details));
	// 		// if (JSON.stringify(prevState.planDetails) !== JSON.stringify(details)) {
	// 		// 	// return {
	// 		// 	// 	...prevState,
	// 		// 	// 	planDetails: details
	// 		// 	// };
	// 		// } else {
	// 		return {
	// 			...prevState
	// 		};
	// 		// }
	// 	});
	// }, [state.planDetails]);
	/* PENDING */
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
	const handleRegistrationModal = async (row) => {
		const thSelectedPlan = [row];
		setState((prevState) => ({
			...prevState,
			planDetails: {
				...prevState.planDetails,
				customer_code: row.ConstructionCode,
				house_type: row.ConstructionTypeName,
				method: row.Method,
				house_code: row.NameCode,
				plan_no: row.PlanNo,
				// RequestAcceptedDate
				th_no: row.RequestNo
			},
			thSelectedPlan,
			thModalVisibility: true
		}));
		await handlePlanDetails(row.ConstructionCode, row.RequestNo);
	};
	const handleRegistrationModalCancel = () => {
		setState((prevState) => ({
			...prevState,
			thModalVisibility: false
		}));
	};
	const handleRegistrationModalOk = async () => {
		const selectedPlan = [...state.thSelectedPlan];
		const toUpdatePlans = plans
			.map((item) => {
				if (
					item.ConstructionCode == selectedPlan[0].ConstructionCode &&
					item.RequestNo == selectedPlan[0].RequestNo
				) {
					return selectedPlan[0];
				}
				return item;
			})
			.filter((item) => !item.finished_date);
		await handleRegister(selectedPlan[0]);
		setState((prevState) => ({
			...prevState,
			plans: toUpdatePlans,
			thModalVisibility: false,
			pagination: {
				...pagination,
				total: toUpdatePlans.length
			}
		}));
		await Http.post('/api/th/plan', selectedPlan[0]);
	};
	/* TH MODAL */
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
		setState((prevState) => ({
			...prevState,
			pagination: {
				...page,
				total: extra.currentDataSource,
				showTotal: (total) => `Total ${total} items`
			}
		}));
	};
	const handleOnChange = async (value, keys = null) => {
		// if (!keys) {
		// 	const e = value;
		// 	await handleSpecs(e.target.value);
		// 	setExpand(true);
		// } else {
		console.log(value, keys);
		if (isObject(value)) {
			const e = value;
			setState((prevState) => ({
				...prevState,
				planDetails: {
					...prevState.planDetails,
					[keys]: e.target.value
				}
			}));
		} else {
			setState((prevState) => ({
				...prevState,
				planDetails: {
					...prevState.planDetails,
					[keys]: value
				}
			}));
			// }
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
			// const details = { ...state.planDetails };
			const { status } = await Http.post('api/henkou/register/th', {
				details: planDetails,
				row
			});

			if (status == 200) {
				openNotificationWithIcon('success');
			}
			// }
		} else {
			const { status } = await Http.post('api/henkou/register/kouzou', {
				details: planDetails
			});

			if (status == 200) {
				openNotificationWithIcon('success');
			}
		}
	};
	const handleOnClickEvent = async (row, key = null) => {
		row[key] = moment()
			.utc()
			.local()
			.format('YYYY-MM-DD HH:mm:ss');
		row.employee_code = user.EmployeeCode;
		const toUpdatePlans = plans.map((item) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setState((prevState) => ({
			...prevState,
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination,
				total: toUpdatePlans.length
			}
		}));
		// if (key == 'finished_date') {
		// 	// row.daysinprocess = moment(row.start_date).diff(row.finished_date, 'days');
		// }
		// const response = await Http.post('/api/th/plan', row);
	};
	const handleInputText = (event, key, row) => {
		row[key] = event.target.value;
		const toUpdatePlans = plans.map((item, index) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setState((prevState) => ({
			...prevState,
			planDetails: {
				...prevState.planDetails,
				[key]: row[key]
			},
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination,
				total: toUpdatePlans.length
			}
		}));
	};
	const handleSelectOption = async (val, key, row) => {
		row[key] = val;
		row.employee_code = user.EmployeeCode;
		const toUpdatePlans = plans.map((item, index) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setState((prevState) => ({
			...prevState,
			loading: false,
			plans: toUpdatePlans,
			planDetails: {
				...prevState.planDetails,
				[key]: row[key]
			}
		}));
		// await handlePlanDetails(row.ConstructionCode, row.RequestNo);
		// const response = await Http.post('/api/th/plan', row);
	};
	/* TH Actions */
	console.info(state);
	const handlePlanDetails = async (customerCode, th_no = null) => {
		try {
			const instance = Http.create({
				baseURL: 'http://hrdapps68:8070/api',
				withCredentials: false
			});
			const { data: plan, status } = await Http.get(`/api/plan/details/${customerCode}`);
			const { process, types, departments, reasons, status_code } = plan;
			if (status == 200 && !status_code) {
				const [firstDigit, secondDigit] = plan.latest
					? plan.latest?.rev_no.split('-')
					: '1-0'.split('-');
				const { data: plan_status } = await instance.get(
					`pcms/planstatus/${customerCode}/${plan.details.method}`
				);

				// const { data: henkou } = await Http.get(`/api/details/${constructionCode}`);
				// let splitRevision = henkou ? henkou.rev_no.split('-') : '';
				// let secondaryRevision = toInteger(splitRevision[1]);
				// setState(prevState=> {
				//     return {
				//         ...prevState,
				//         planDetails['id']: plan?.latest?.id,

				//     }
				// })
				setState((prevState) => ({
					...prevState,
					products: plan?.products,
					types,
					departments,
					reasons,
					planDetails: {
						...prevState.planDetails,
						id: plan?.latest?.id,
						customer_code: customerCode,
						house_code: plan.details.house_code,
						house_type: plan.details.house_type,
						method: plan.details.method,
						plan_no: plan.details.plan_no,
						floors: plan.details.floors,
						joutou_date: plan.details.joutou_date,
						days_before_joutou: plan.details.days_before_joutou,
						kiso_start: plan.details.kiso_start,
						before_kiso_start: plan.details.before_kiso_start,
						dodai_invoice: plan.invoice.find((item) =>
							item.InvoiceName.match(/DODAI/gi)
						)?.Invoice,
						['1F_panel_invoice']: plan.invoice.find((item) =>
							item.InvoiceName.match(/PANEL/gi)
						)?.Invoice,
						['1F_hari_invoice']: plan.invoice.find((item) =>
							item.InvoiceName.match(/HARI/gi)
						)?.Invoice,
						['1F_iq_invoice']: plan.invoice.find((item) =>
							item.InvoiceName.match(/IQ/gi)
						)?.Invoice,
						plan_specification: plan.specification
							.map((item) => item?.SpecificationName)
							.join(', '),
						existing_rev_no: plan.latest ? plan.latest.rev_no : null,
						rev_no: plan.latest ? `${firstDigit}-${toInteger(secondDigit) + 1}` : '1-0',
						type_id: th_no ? 2 : 1,
						// reason_id: '',
						// logs: '',
						plan_status:
							'Not found' &&
							process.find((plan) => plan.id == plan_status?.id)?.plan_status_name,
						plan_status_id: 'Not found' && plan_status?.id,
						th_no: th_no ? th_no : null,
						// department_id: '',
						section_id: user.SectionCode,
						team_id: user.TeamCode,
						updated_by: user.EmployeeCode
					}
				}));
			}
			return plan;
		} catch (err) {
			console.error(err);
		}
	};
	const consolidatedHenkouLogs = async (products) => {
		// const [firstIndex] = details.rev_no.split('-');
		// const [firstDigit, secondDigit] = planDetails?.rev_no.split('-');
		// const fetchConsolidatedLogs = await Http.get(
		// 	`api/henkou/plans/${planDetails.customer_code}/revision/${firstDigit}`
		// );
		// const fetchConsolidatedPendingDetails = await Http.get(
		// 	`/api/henkou/plans/pending/${details.customer_code}`
		// );
		const THreleasing = [1, 6, 26, 37];
		const productLogs = products
			.map(({ pendings, ...rest }) => ({ ...rest }))
			.filter(({ affected_id }) => THreleasing.indexOf(affected_id) == -1);
		const detailsLogs = products
			.filter(
				(val, id, arr) =>
					arr.findIndex(
						(item) =>
							item.plan.logs === val.plan.logs && item.plan.rev_no === val.plan.rev_no
					) === id
			)
			.map((val) => val.plan);

		const pendingLogs = products
			.map((item) => {
				return item.pendings;
			})
			.flat(1);

		// console.log(pendingLogs);
		// const productPendingLogs = fetchConsolidatedPendingDetails.data.map((item) => {
		// 	return {
		// 		...item,
		// 		product_name:
		// 			master.products.length > 0
		// 				? master.products.find((el) => {
		// 						const affectedProds = master.affectedProducts.find(
		// 							(el) => el.id == item.affected_id
		// 						)
		// 							? master.affectedProducts.find(
		// 									(el) => el.id == item.affected_id
		// 							  ).product_category_id
		// 							: null;
		// 						return affectedProds ? el.id == affectedProds : null;
		// 				  })
		// 					? master.products.find((el) => {
		// 							const affectedProds = master.affectedProducts.find(
		// 								(el) => el.id == item.affected_id
		// 							)
		// 								? master.affectedProducts.find(
		// 										(el) => el.id == item.affected_id
		// 								  ).product_category_id
		// 								: null;
		// 							return affectedProds ? el.id == affectedProds : null;
		// 					  }).product_name
		// 					: null
		// 				: null
		// 	};
		// });
		const henkouLogs = [...detailsLogs, ...productLogs];
		// console.log(henkouLogs);
		const mergeLogs = [...henkouLogs, ...pendingLogs];
		console.log(mergeLogs);
		setLogs(
			mergeLogs
				.map((item) => {
					return {
						...item,
						id: item.id,
						borrow_details: item.borrow_details,
						rev_no: item.rev_no,
						product_name: item.product_name,
						updated_by: item.updated_by,
						log: item.logs,
						created_at: item.created_at
					};
				})
				.sort((a, b) => moment(a.created_at).diff(b.created_at))
		);
	};
	const handleSpecs = async (customerCode, th_no = null) => {
		try {
			clearDetails();
			const plan = await handlePlanDetails(customerCode, th_no);
			if (plan?.status_code == 500) {
				return { status: 'notvalid', msg: 'Enter valid customer code!' };
			} else if (plan?.latest) {
				const { productslogs, latest, products } = plan;
				// const fetchStatus = await Http.get(
				// 	`/api/henkou/plans/${plan.latest.customer_code}/products/${plan.latest.id}`
				// );
				await consolidatedHenkouLogs(productslogs);
				const ongoingProduct = products.find(
					(item) =>
						(!item.assessment_id || item.assessment_id == 1) &&
						item.received_date &&
						item.start_date &&
						!item.finished_date
				);

				const notyetStartedProduct = products.find(
					(item) =>
						(!item.assessment_id || item.assessment_id == 1) &&
						item.received_date &&
						!item.start_date &&
						!item.finished_date
				);
				const finalCheckingFinished = products.find(
					(el) =>
						(!el.assessment_id || el.assessment_id == 1) &&
						(el.affected_id == 5 ||
							el.affected_id == 25 ||
							el.affected_id == 36 ||
							el.affected_id == 58) &&
						el.received_date &&
						el.start_date &&
						el.finished_date
				);
				if (finalCheckingFinished) {
					const [firstIndex] = finalCheckingFinished.rev_no.split('-');
					setState((prevState) => ({
						...prevState,
						planDetails: {
							...prevState.planDetails,
							rev_no: `${firstIndex}-0`
						}
					}));
				}

				if (notyetStartedProduct) {
					console.log(notyetStartedProduct);
					return {
						status: 'notyetstarted',
						msg: notyetStartedProduct.affected_product.product_category.product_name,
						dept: [
							...new Map(
								notyetStartedProduct.affected_product.product_category.designations
									.map(({ department }) => ({
										id: department.DepartmentCode,
										name: department.DepartmentName
									}))
									.map((item) => [item['id'], item])
							).values()
						]
							.map((department) => department.name)
							.toString()
					};
				} else if (ongoingProduct) {
					// const pendingResource = await Http.get(
					// 	`api/henkou/plans/pending/${plan.latest.customer_code}/${findOngoingProduct.affected_id}`
					// );
					if (ongoingProduct.pendings.length == 0) {
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
									remarks: '',
									updated_by: user.EmployeeCode
								});
							}
							setPendingState({
								...pendingState,
								items: pending,
								row: { ...ongoingProduct, affected_id: ongoingProduct.affected_id }
							});
						}
					} else if (pendingState.items.length == 0) {
						setPendingState({
							...pendingState,
							row: { ...ongoingProduct, affected_id: ongoingProduct.affected_id },
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

					return {
						status: 'ongoing',
						msg: ongoingProduct.product_name,
						dept: ongoingProduct.employee.department.DepartmentName
					};
				}
			} else {
				return { status: 'found', msg: 'No existing henkou!' };
			}
		} catch (error) {
			console.error(error);
		}
	};

	const clearDetails = () => {
		setState((prevState) => ({
			...prevState,
			planDetails: {
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
			}
		}));
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
					status: products,
					updated_by: user.EmployeeCode,
					sectionCode: user.SectionCode,
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
				);

				const filteredPendingItems = pendingState.items
					.filter((item) => {
						return item.start || item.resume || item.reason;
					})
					.map((item) => {
						return {
							...item,
							updated_by: user.employee_no,
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
			updated_by: user.EmployeeCode,
			start: '',
			reason: '',
			resume: '',
			remarks: '',
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
			{user.SectionCode == '00465' && user.TeamCode == '00133' ? (
				<>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div className="title-page">Register TH Plans</div>
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
									setState((prevState) => ({
										...prevState,
										filterplans: nameSearch
											? plans.filter(
													(person) =>
														person?.ConstructionCode?.includes(
															nameSearch
														) ||
														person?.NameCode?.match(
															new RegExp(`${nameSearch}`, 'gi')
														)
											  )
											: [],
										pagination: {
											...pagination,
											total: nameSearch ? filterplans.length : plans.length
										}
									}))
								}></Input.Search>
						</div>
					</div>
					<div style={{ margin: '0 10px' }}>
						{loading && plans.length == 0 ? (
							<Skeleton active />
						) : plans.length !== 0 ? (
							<Table
								size="small"
								columns={headers(getColumnSearchProps, state, {
									handleClickPDF,
									handleSelectOption,
									handleOnClickEvent,
									handleInputText,
									handleRegistrationModal
								})}
								bordered
								// locale={{
								// 	emptyText: loading ? <Skeleton active={true} /> : <Empty />
								// }}
								// rowKey={(record) => record.PlanNo}
								dataSource={
									loading ? [] : filterplans.length > 0 ? filterplans : plans
								}
								pagination={pagination}
								rowClassName={'antd-cell-no-padding'}
								scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
								onChange={handleTableChange}
							/>
						) : (
							<Empty />
						)}
					</div>

					<Modal
						title="PDF Lists"
						onOk={handleOk}
						onCancel={handleCancel}
						bodyStyle={{ padding: 0 }}
						visible={isModalVisible.modal}>
						<PDFLists pdfLists={isModalVisible.foundsList}></PDFLists>
					</Modal>
					<Modal
						title={`${state.planDetails.customer_code}/${state.planDetails.house_code}/${state.planDetails.th_no}`}
						onOk={handleRegistrationModalOk}
						okText="Register"
						onCancel={handleRegistrationModalCancel}
						bodyStyle={{ padding: 10 }}
						width={1000}
						okButtonProps={{
							disabled: state.thSelectedPlan.some((item) => !item.finished_date)
						}}
						// confirmLoading={confirmLoading}
						visible={state.thModalVisibility}>
						{/* <HenkouTable headers={PendingHeaders()} data={pendingItems} /> */}
						<Table
							columns={modalHeader(getColumnSearchProps, state, {
								handleClickPDF,
								handleSelectOption,
								handleOnClickEvent,
								handleInputText,
								handleRegistrationModal
							})}
							dataSource={thSelectedPlan}
							pagination={false}
							bordered
						/>
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
						props={state}
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
						}}></ManualContainer>
				</>
			)}
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(withSearch(Registration));
