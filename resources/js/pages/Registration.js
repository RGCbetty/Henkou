/* Utilities */
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Http from '../Http';
import { connect } from 'react-redux';
import moment from 'moment';
import { isObject, toInteger } from 'lodash';
import Highlighter from 'react-highlight-words';
import durationAsString from '../utils/diffDate';

/* Component */
import PDFLists from '../components/RegistrationComponents/PDFLists';
import ManualContainer from '../components/RegistrationComponents/ManualContainer';
import { headers } from '../components/RegistrationComponents/THPlansHeader';

/* Material Design */
import { Modal, notification, Table, Input, Space, Button, Skeleton, Empty, Spin } from 'antd';

/* API */
import { useThPlansRetriever, THplansWithPlanStatus, fetchThTemp, fetchThPlans } from '../api/TH';
// import { useActivePlanStatus, getPlanStatusByCustomerCode } from '../api/planstatus';
import { fetchDetails } from '../api/details';
import { SearchOutlined } from '@ant-design/icons';
import { setMaster } from '../redux/actions/master';
import { useMasterDetails } from '../api/master';
import { useProductsRetriever, useAffectedProductsRetriever } from '../api/products';
// import { productCategories } from '../redux/reducers/PCMSproductCategories';

const Registration = ({ title, dispatch, ...rest }) => {
	const { userInfo, master } = rest;
	const inputRef = useRef();
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	// const [planStatuses, setPlanStatuses] = useMasterPlanStatuses();
	// const [productCategoriesPCMS, setProductCategoriesPCMS] = useActivePlanStatus();
	// const [affectedProducts, setAffectedProducts] = useAffectedProductsRetriever();
	// const [info, setInfo] = useMasterDetails();
	const [tableState, setTable] = useThPlansRetriever(userInfo);
	const { plans, pagination, loading } = tableState;
	const { showTotal, ...paginate } = pagination;

	// const [departments, setDepartments] = useMasterDepartment();
	// const [sections, setSections] = useMasterSection();
	// const [teams, setTeams] = useMasterTeam();
	// const [company, setCompany] = useMasterCompany();
	// const [tempTh, setTempTh] = useTempThRetriever();
	// const [products, setProducts] = useProductsRetriever();
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
	const [state, setState] = useState({
		searchedColumn: '',
		searchText: ''
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
	const handleTableChange = (page, filters, sorter) => {
		setTable({
			...tableState,
			pagination: {
				...page,
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
	const handleRegister = async (details, row = null) => {
		// if (details.method == 2) {
		// 	console.log(details);
		// } else if (details.method == 1) {
		// 	console.log(details);
		// }
		if (row) {
			// if (row.Method == '2') {
			const affectedProducts = await Http.get(
				`api/products/planstatus/${row.plan_status.id}`
			);

			if (affectedProducts.data.length > 0) {
				const mappedProducts = affectedProducts.data.map((item) => {
					return {
						...item,
						assessment_id: row ? row.th_assessment_id : null,
						remarks: row ? row.remarks : null,
						received_date: row ? row.RequestAcceptedDate : null,
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				});
				details['logs'] = row.remarks;
				const response = await Http.post('/api/details', {
					details,
					product: mappedProducts,
					row
				});

				if (response.status == 200) {
					openNotificationWithIcon('success');
				}
			}
		} else {
			const affectedProducts = await Http.get(
				`api/products/planstatus/${details.plan_status_id}`
			);
			if (affectedProducts.data.length > 0) {
				const mappedProducts = affectedProducts.data.map((item) => {
					return {
						...item,
						assessment_id: row ? row.th_assessment_id : null,
						remarks: details ? details.logs : null,
						received_date: row ? row.RequestAcceptedDate : null,
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				});
				const response = await Http.post('/api/details', {
					details,
					product: mappedProducts
				});

				if (response.status == 200) {
					openNotificationWithIcon('success');
				}
			}
		}
		// } else if (row.Method == '1') {
		// }
	};
	const getColumnSearchProps = (dataIndex, title) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={inputRef}
					placeholder={`Search ${title}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setState({
								searchText: selectedKeys[0],
								searchedColumn: dataIndex
							});
						}}>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => inputRef.current, 100);
			}
		},
		render: (text) =>
			state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[state.searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			)
	});

	const handleSearch = async (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex
		});
	};
	const handleReset = async (clearFilters) => {
		clearFilters();
		setState({
			searchText: '',
			searchedColumn: ''
		});
	};
	// const handleRegister = async (details, row = null) => {
	// 	console.log(details);
	// 	if (details.method == '2') {
	// 		const owner = products.data.filter((item, index) => {
	// 			if (
	// 				rest.userInfo.DepartmentCode == item.department_id &&
	// 				rest.userInfo.SectionCode == item.section_id &&
	// 				rest.userInfo.TeamCode == item.team_id
	// 			) {
	// 				return item;
	// 			}
	// 		});

	// 		const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
	// 		let params = {};
	// 		for (let i = 0; i < sortBySequenceOwner.length; i++) {
	// 			params[`product_${i + 1}`] = owner[i].product_key;
	// 		}
	// 		const customerKey = await Http.get(`api/customer`, { params: params });
	// 		const customers = customerKey.data.map((item) => {
	// 			return {
	// 				...item,
	// 				products:
	// 					products.data.length > 0
	// 						? products.data.filter((el) => {
	// 								return el.product_key == item.customer_key;
	// 						  })
	// 						: null
	// 			};
	// 		});

	// 		let customer = [];
	// 		for (let i = 0; i < sortBySequenceOwner.length; i++) {
	// 			for (let j = 0; j < customers.length; j++) {
	// 				if (sortBySequenceOwner[i].product_key == customers[j].product_key) {
	// 					for (let k = 0; k < customers[j].products.length; k++) {
	// 						customer.push(customers[j].products[k]);
	// 					}
	// 				}
	// 			}
	// 		}
	// 		const mappedProducts = products.data.map((item, index) => {
	// 			if (
	// 				customer.find((el) => {
	// 					return el.id == item.id;
	// 				})
	// 			) {
	// 				return {
	// 					...item,
	// 					remarks: row ? row.remarks : null,
	// 					received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
	// 					start_date: row ? row.start_date : null,
	// 					finished_date: row ? row.finished_date : null
	// 				};
	// 			}
	// 			if (
	// 				rest.userInfo.DepartmentCode == item.department_id &&
	// 				rest.userInfo.SectionCode == item.section_id &&
	// 				rest.userInfo.TeamCode == item.team_id
	// 			) {
	// 				return {
	// 					...item,
	// 					remarks: row ? row.remarks : null,
	// 					received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
	// 					start_date: row ? row.start_date : null,
	// 					finished_date: row ? row.finished_date : null
	// 				};
	// 			}
	// 			return item;
	// 		});
	// 		const sortedProducts = _.sortBy(mappedProducts, ['waku_sequence', 'product_name']);
	// 		const response = await Http.post('/api/details', {
	// 			details,
	// 			product: sortedProducts
	// 		});
	// 		if (response.status == 200) {
	// 			openNotificationWithIcon('success');
	// 		}
	// 		setProducts(sortedProducts);
	// 	} else {
	// 		const owner = products.data.filter((item, index) => {
	// 			if (
	// 				rest.userInfo.DepartmentCode == item.department_id &&
	// 				rest.userInfo.SectionCode == item.section_id &&
	// 				rest.userInfo.TeamCode == item.team_id
	// 			) {
	// 				return item;
	// 			}
	// 		});

	// 		const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
	// 		let params = {};
	// 		for (let i = 0; i < sortBySequenceOwner.length; i++) {
	// 			params[`product_${i + 1}`] = owner[i].product_key;
	// 		}
	// 		const customerKey = await Http.get(`api/customer`, { params: params });
	// 		const customers = customerKey.data.map((item) => {
	// 			return {
	// 				...item,
	// 				products:
	// 					products.data.length > 0
	// 						? products.data.filter((el) => {
	// 								return el.product_key == item.customer_key;
	// 						  })
	// 						: null
	// 			};
	// 		});

	// 		let customer = [];
	// 		for (let i = 0; i < sortBySequenceOwner.length; i++) {
	// 			for (let j = 0; j < customers.length; j++) {
	// 				if (sortBySequenceOwner[i].product_key == customers[j].product_key) {
	// 					for (let k = 0; k < customers[j].products.length; k++) {
	// 						customer.push(customers[j].products[k]);
	// 					}
	// 				}
	// 			}
	// 		}
	// 		const mappedProducts = products.data.map((item, index) => {
	// 			if (
	// 				customer.find((el) => {
	// 					return el.id == item.id;
	// 				})
	// 			) {
	// 				return {
	// 					...item,
	// 					remarks: row.remarks,
	// 					received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
	// 					start_date: row ? row.start_date : null,
	// 					finished_date: row ? row.finished_date : null
	// 				};
	// 			}
	// 			if (
	// 				rest.userInfo.DepartmentCode == item.department_id &&
	// 				rest.userInfo.SectionCode == item.section_id &&
	// 				rest.userInfo.TeamCode == item.team_id
	// 			) {
	// 				return {
	// 					...item,
	// 					remarks: row ? row.remarks : null,
	// 					received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
	// 					finished_date: row ? row.finished_date : null,
	// 					start_date: row ? row.start_date : null,
	// 					finished_date: row ? row.finished_date : null
	// 				};
	// 			}
	// 			return item;
	// 		});
	// 		const sortedProducts = _.sortBy(mappedProducts, ['jiku_sequence', 'product_name']);
	// 		const response = await Http.post('/api/details', {
	// 			details,
	// 			product: sortedProducts
	// 		});
	// 		if (response.status == 200) {
	// 			openNotificationWithIcon('success');
	// 		}
	// 		setProducts(sortedProducts);
	// 	}
	// };
	/* TH Actions */
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
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination,
				total: toUpdatePlans.length,
				showTotal: (total) => `Total ${total} items`
				// 200 is mock data, you should read it from server
				// total: data.totalCount,
			}
		});
		if (key == 'finished_date') {
			row.daysinprocess = moment(row.start_date).diff(row.finished_date, 'days');
			await handleRegister(details, row);
		}
		const response = await Http.post('/api/th/plan', row);
	};
	const handleInputText = (event, key, row) => {
		row[key] = event.target.value;

		const toUpdatePlans = plans.map((item, index) => {
			if (item.ConstructionCode == row.ConstructionCode && item.RequestNo == row.RequestNo) {
				return row;
			}
			return item;
		});
		setTable({
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination
				// 200 is mock data, you should read it from server
				// total: data.totalCount,
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
			loading: false,
			plans: toUpdatePlans,
			pagination: {
				...pagination
				// 200 is mock data, you should read it from server
				// total: data.totalCount,
			}
		});
		const response = await Http.post('/api/th/plan', row);

		// if (key == 'th_action_id') {
		// 	if (val == 4) {
		// 		await handleRegister(details, row);
		// 	}
		// }
		await handleSpecs(row.ConstructionCode, row.RequestNo);
	};
	/* TH Actions */
	const handleSpecs = async (constructionCode, th_no = null) => {
		try {
			const instance = Http.create({
				baseURL: 'http://hrdapps68:8070/api',
				withCredentials: false
			});
			// const planstatuses = await Http.get('/api/planstatuses');
			const response = await Http.get(`/api/plandetails/${constructionCode}`);
			const planstatus = await instance.get(
				`pcms/planstatus/${constructionCode}/${
					response.data.house.length > 0 ? response.data.house[0].Method : null
				}`
			);
			console.log(planstatus);
			const revision = await Http.get(`/api/details/${constructionCode}`);
			const { plan_specs } = response.data;
			let plan_specification = [];
			for (let i = 0; i < plan_specs.length; i++) {
				for (const property in plan_specs[i]) {
					if (plan_specs[i][property] !== '0') {
						plan_specification.push(property);
					}
				}
			}
			// const planSpecs = plan_specs.map((item, index) => {
			// 	let str = '';
			// 	if (item.Menshin !== '0') {
			// 		str += 'Menshin';
			// 	}
			// 	if (item.Gousetsu !== '0') {
			// 		str ? (str += ',Gousetsu') : (str += 'Gousetsu');
			// 	}
			// 	if (item.CY !== '0') {
			// 		str ? (str += ',CY') : (str += 'CY');
			// 	}
			// 	if (item['3Storey'] !== '0') {
			// 		str ? (str += ',3Storey') : (str += '3Storey');
			// 	}
			// 	return str;
			// });

			// console.log(planSpecs);
			let splitRevision = revision.data ? revision.data.rev_no.split('-') : '';
			let secondaryRevision = toInteger(splitRevision[1]);
			if (response.data.house.length > 0 && response.data.construction_schedule.length > 0) {
				setDetails((prevState) => {
					return {
						...prevState,
						customer_code: constructionCode,
						house_code:
							response.data.house.length > 0 ? response.data.house[0].NameCode : null,
						house_type:
							response.data.house.length > 0
								? response.data.house[0].ConstructionTypeName
								: null,
						method:
							response.data.house.length > 0 ? response.data.house[0].Method : null,
						plan_no:
							response.data.house.length > 0 ? response.data.house[0].PlanNo : null,
						floors:
							response.data.house.length > 0 ? response.data.house[0].Floors : null,
						joutou_date:
							response.data.construction_schedule.length > 0
								? response.data.construction_schedule[0].ExpectedHouseRaisingDate
								: null,
						days_before_joutou: '',
						kiso_start:
							response.data.construction_schedule.length > 0
								? response.data.construction_schedule[0].StartedFoundationWorkDate
								: null,
						before_kiso_start: '',
						dodai_invoice:
							response.data.invoice.length > 0
								? response.data.invoice[0].InvoiceDodai
								: null,
						['1F_panel_invoice']:
							response.data.invoice.length > 0
								? response.data.invoice[0].InvoicePanel
								: null,
						['1F_hari_invoice']:
							response.data.invoice.length > 0
								? response.data.invoice[0].Invoice1FHari
								: null,
						['1F_iq_invoice']:
							response.data.invoice.length > 0
								? response.data.invoice[0].Invoice1FIQ
								: null,
						plan_specification: plan_specification.join(),
						existing_rev_no: revision.data.rev_no,
						rev_no: revision.data
							? `${splitRevision[0]}-${secondaryRevision + 1}`
							: '1-0',
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
				const detailsItem = await fetchDetails(constructionCode);
				setDetails((prevState) => {
					return {
						...prevState,
						...detailsItem
					};
				});
				if (detailsItem) {
					const fetchStatus = await Http.get(
						`/api/henkou/plans/${detailsItem.customer_code}/products/${detailsItem.id}`
					);
					const fetchConsolidatedLogs = await Http.get(
						`/api/henkou/plans/${detailsItem.customer_code}/logs`
					);
					const fetchConsolidatedPendingDetails = await Http.get(
						`/api/henkou/plans/pending/${detailsItem.customer_code}`
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
												return affectedProds
													? el.id == affectedProds
													: null;
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
												return affectedProds
													? el.id == affectedProds
													: null;
										  }).product_name
										: null
									: null
						};
					});

					const mergeLogs = [...productLogs, ...productPendingLogs];
					setLogs(
						mergeLogs
							.map((item) => {
								return {
									id: item.id,
									borrow_details: item.borrow_details,
									rev_no: item.rev_no,
									product_name: item.product_name,
									log: item.log,
									created_at: item.created_at
								};
							})
							.sort((a, b) => moment(a.created_at).diff(b.created_at))
					);
					setStatus(fetchStatus.data);

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
														(!el.assessment_id ||
															el.assessment_id == 1) &&
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
														(!el.assessment_id ||
															el.assessment_id == 1) &&
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
														(!el.assessment_id ||
															el.assessment_id == 1) &&
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
					} else if (onGoingProductRow.product_name) {
						const pendingResource = await Http.get(
							`api/henkou/plans/pending/${detailsItem.customer_code}/${affectedProds.id}`
						);
						if (pendingResource.data.length == 0) {
							if (pendingState.items.length == 0) {
								let pending = [];
								for (let i = 0; i < 1; i++) {
									pending.push({
										pending_id: null,
										pending_index: i + 1,
										rev_no: detailsItem.rev_no,
										start: '',
										reason: '',
										resume: '',
										duration: '',
										product_key: master.affectedProducts.find(
											(ap) =>
												ap.id ==
												fetchStatus.data.find(
													(el) =>
														(!el.assessment_id ||
															el.assessment_id == 1) &&
														el.received_date &&
														!el.finished_date
												).affected_id
										).product_category_id
									});
								}

								// const stats = fetchStatus.data.find(
								// 	(el) =>
								// 		(!el.assessment_id || el.assessment_id == 1) &&
								// 		el.received_date &&
								// 		el.start_date &&
								// 		!el.finished_date
								// )
								// 	? fetchStatus.data.find(
								// 			(el) =>
								// 				(!el.assessment_id || el.assessment_id == 1) &&
								// 				el.received_date &&
								// 				el.start_date &&
								// 				!el.finished_date
								// 	  ).affected_id
								// 	: null;
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
			}
			//  else {
			// 	return { status: 'not found' };
			// }
		} catch (error) {
			// return { status: 'not found' };
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
				// const diff_seconds = moment(row.start).diff(row.resume, 'seconds');
				// const ms = moment(row.resume, 'YYYY-MM-DD HH:mm:ss').diff(
				// 	moment(row.start, 'YYYY-MM-DD HH:mm:ss')
				// );
				// const d = moment.duration(ms);
				// record.resume_date = row[key];
				record.duration = isNaN(moment(record.start).diff(record.resume))
					? ''
					: durationAsString(record.start, record.resume);
				// setRow({ ...row });
				// row.pending_id = row.pending_id + 1;
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
		// console.log(value, key, record, 'Onselect');
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
		// setPendingItems([]);
		// setRow({ ...row, disableFinish: false });
		// setRow({});
	};
	const handlePendingCancel = () => {
		const filterPendingItems = pendingState.items.filter((item) => item.pending_id);
		setPendingState({
			...pendingState,
			items: filterPendingItems,
			isPendingModalVisible: false
		});

		// setRow({});
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
					<div className="title-page">Register TH Plans</div>
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
						// loading={loading}
						bordered
						locale={{
							emptyText: loading ? <Skeleton active={true} /> : <Empty />
						}}
						dataSource={loading ? [] : plans}
						pagination={pagination}
						// dataSource={plans}
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

export default connect(mapStateToProps)(Registration);
