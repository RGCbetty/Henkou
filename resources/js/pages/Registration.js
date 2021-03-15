/* Utilities */
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Http from '../Http';
import { connect } from 'react-redux';
import moment from 'moment';
import { isObject, toInteger } from 'lodash';
import Highlighter from 'react-highlight-words';

/* Component */
import PDFLists from '../components/RegistrationComponents/PDFLists';
import ManualContainer from '../components/RegistrationComponents/ManualContainer';
import { headers } from '../components/RegistrationComponents/THPlansHeader';

/* Material Design */
import { Modal, notification, Table, Input, Space, Button } from 'antd';

/* API */
import { useThPlansRetriever, fetchThPlans, useTempThRetriever } from '../api/TH';
import { useActivePlanStatus, getPlanStatusByCustomerCode } from '../api/planstatus';
import { fetchDetails } from '../api/details';
import { SearchOutlined } from '@ant-design/icons';
import { productCategories } from '../redux/actions/productCategories';
import {
	useMasterDetails,
	useMasterCompany,
	useMasterDepartment,
	useMasterSection,
	useMasterTeam,
	useMasterPlanStatuses
} from '../api/master';
import { useProductsRetriever } from '../api/products';
// import { productCategories } from '../redux/reducers/PCMSproductCategories';

const Registration = ({ title, dispatch, ...rest }) => {
	const { userInfo } = rest;
	const inputRef = useRef();
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	useEffect(() => {
		setDetails(details);
	}, [details]);
	const [planStatuses, setPlanStatuses] = useMasterPlanStatuses();
	const [productCategoriesPCMS, setProductCategoriesPCMS] = useActivePlanStatus();
	const [info, setInfo] = useMasterDetails();
	const [departments, setDepartments] = useMasterDepartment();
	const [sections, setSections] = useMasterSection();
	const [teams, setTeams] = useMasterTeam();
	const [company, setCompany] = useMasterCompany();
	const [tempTh, setTempTh] = useTempThRetriever();
	const [products, setProducts] = useProductsRetriever();
	const [henkouStatus, setStatus] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState({
		modal: false,
		foundsList: []
	});
	const [state, setState] = useState({
		searchedColumn: '',
		searchText: ''
	});
	// console.log(tableTH, 'teaopektopesktposakepotaksepotkpaosektapoesktpoasekt');
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
	const firstUpdate = useRef(true);
	useLayoutEffect(() => {
		if (!firstUpdate.current) {
			firstUpdate.current = false;
		}
	}, [details]);

	// const showModal = () => {
	//     setIsModalVisible(true);
	// };
	const handleOk = () => {
		setIsModalVisible({ modal: false, foundsList: [] });
	};

	/*  */
	const getPlanStatus = async (henkouDetails) => {
		// let
		// Http.get(`api/planstatus/${1}`).then(response => );

		const planStatus = await getPlanStatusByCustomerCode(
			henkouDetails,
			productCategoriesPCMS,
			rest
		);

		if (henkouDetails.Method == 1) {
			if (
				planStatus.find(
					(item) => item.Status == 'Finished' && item.ProductCode == 'aPi@wUk3D'
				)
			) {
				// planStatus.find(
				// 	(item) =>
				// 		(item.Status == 'Finished' && item.ProductCode == 'WQz0k4no5B9') ||
				// 		item.ProductCode == 'WQz0k4no5B9'
				// )
				return planStatus.find(
					(item) =>
						item.Status == 'Finished' &&
						(item.ProductCode == 'DbwGj5G8Y' || item.ProductCode == 'WQz0k4no5B9')
				)
					? 4
					: 3;
			}
		} else if (henkouDetails.Method == 2) {
			if (
				planStatus.find(
					(item) => item.Status == 'Finished' && item.ProductCode == 'aPi@wUk3D'
				)
			)
				return planStatus.find(
					(item) => item.Status == 'Finished' && item.ProductCode == 'iTJq1UgNMJr'
				)
					? 2
					: 1;
		}
	};
	const [tableTH, setTable] = useThPlansRetriever(userInfo, getPlanStatus);
	const { plans, pagination, loading } = tableTH;

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
	const handleTableChange = async (page, filters, sorter) => {
		let mounted = true;
		try {
			const planstatus = await Http.get('/api/planstatuses');
			const response = await fetchThPlans(setTable, page);
			const { henkouPlans, pagination, total } = await response;
			async function findAsync(arr, id) {
				const promises = arr.map(async (item) => {
					return item.id == id ? item : null;
				});
				const results = await Promise.all(promises);

				const index = results.findIndex((result) => result);

				return arr[index] ? arr[index] : null;
			}
			const THplans = await Promise.all(
				henkouPlans.map(async (item, index) => {
					return {
						...item,
						remarks: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).remarks
							: null,
						th_assessment_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_assessment_id
							: null,
						reason_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).reason_id
							: null,
						th_action_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_action_id
							: null,
						start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).start_date
							: null,
						finished_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).finished_date
							: null,
						pending_start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_start_date
							: null,
						pending_resume_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_resume_date
							: null,
						plan_status: await findAsync(planstatus.data, await getPlanStatus(item))
					};
				})
			);
			if (mounted)
				setTable({
					loading: false,
					plans: THplans,
					pagination: {
						...pagination,
						total: total,
						showTotal: (total) => `Total ${total} items.`
					}
				});
		} catch (e) {
			if (e) mounted = false;
		}
	};

	const handleOnChange = async (value, keys = null) => {
		if (!keys) {
			const e = value;
			await handleSpecs(e.target.value);
			setExpand(true);
		} else {
			if (isObject(value)) {
				const e = value;
				let logs = `Today is the day \n${e.target.value}`;
				setDetails({ ...details, [keys]: logs });
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
	const handleRegister = async (details, row = null) => {
		// if (details.method == 2) {
		// 	console.log(details);
		// } else if (details.method == 1) {
		// 	console.log(details);
		// }
		if (row)
			if (row.Method == '2') {
				const affectedProducts = await Http.get(
					`api/products/planstatus/${row.plan_status.id}`
				);
				if (affectedProducts.data.length > 0) {
					const mappedProducts = affectedProducts.data.map((item) => {
						return {
							...item,
							assessment_id: row ? row.th_assessment_id : null,
							remarks: row ? row.remarks : null,
							received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
							start_date: row ? row.start_date : null,
							finished_date: row ? row.finished_date : null
						};
					});
					details['logs'] = row.remarks;
					const response = await Http.post('/api/details', {
						details,
						product: mappedProducts
					});
					console.log(response);

					if (response.status == 200) {
						openNotificationWithIcon('success');
					}
				}
				// setProducts(sortedProducts);
			} else if (row.Method == '1') {
			}
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
		const planstatus = await Http.get('/api/planstatuses');
		setTable({
			loading: true
		});
		console.log(selectedKeys);
		if (selectedKeys.length > 0) {
			const filterTHplans = await Http.get('/api/plan', {
				params: { [`${dataIndex}`]: selectedKeys[0], ...pagination }
			});
			console.log(filterTHplans);
			const { data, total } = filterTHplans.data;
			async function findAsync(arr, id) {
				const promises = arr.map(async (item) => {
					return item.id == id ? item : null;
				});
				const results = await Promise.all(promises);

				const index = results.findIndex((result) => result);

				return arr[index] ? arr[index] : null;
			}
			const THplans = await Promise.all(
				data.map(async (item, index) => {
					return {
						key: index,
						...item,
						remarks: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).remarks
							: null,
						th_assessment_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_assessment_id
							: null,
						reason_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).reason_id
							: null,
						th_action_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_action_id
							: null,
						start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).start_date
							: null,
						finished_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).finished_date
							: null,
						pending_start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_start_date
							: null,
						pending_resume_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_resume_date
							: null,
						plan_status: await findAsync(planstatus.data, await getPlanStatus(item))
					};
				})
			);
			setTable({
				loading: false,
				plans: THplans,
				pagination: {
					...pagination,
					total: total,
					showTotal: (total) => `Total ${total} items.`
					// 200 is mock data, you should read it from server
					// total: data.totalCount,
				}
			});
			setState({
				searchText: selectedKeys[0],
				searchedColumn: dataIndex
			});
		} else {
			setTable({
				loading: false,
				...tableTH
			});
		}

		// confirm();
	};
	const handleReset = async (clearFilters) => {
		let mounted = true;
		try {
			const planstatus = await Http.get('/api/planstatuses');
			const page = {
				current: 1,
				pageSize: 5
			};
			const response = await fetchThPlans(setTable, page);
			const { henkouPlans, pagination, total } = await response;
			async function findAsync(arr, id) {
				const promises = arr.map(async (item) => {
					return item.id == id ? item : null;
				});
				const results = await Promise.all(promises);

				const index = results.findIndex((result) => result);

				return arr[index] ? arr[index] : null;
			}
			const THplans = await Promise.all(
				henkouPlans.map(async (item, index) => {
					return {
						...item,
						remarks: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).remarks
							: null,
						th_assessment_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_assessment_id
							: null,
						reason_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).reason_id
							: null,
						th_action_id: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_action_id
							: null,
						start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).start_date
							: null,
						finished_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).finished_date
							: null,
						pending_start_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_start_date
							: null,
						pending_resume_date: tempTh.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTh.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_resume_date
							: null,
						plan_status: await findAsync(planstatus.data, await getPlanStatus(item))
					};
				})
			);
			if (mounted)
				setTable({
					loading: false,
					plans: THplans,
					pagination: {
						...pagination,
						total: total,
						showTotal: (total) => `Total ${total} items.`
					}
				});
		} catch (e) {
			if (e) mounted = false;
		}
		clearFilters();

		setState({ searchText: '' });
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
		row[key] = moment().format('YYYY-MM-DD HH:mm:ss');

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
		const response = await Http.get(`/api/plandetails/${constructionCode}`);
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
		if (response.data.house.length > 0 && response.data.construction_schedule.length > 0)
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
					method: response.data.house.length > 0 ? response.data.house[0].Method : null,
					plan_no: response.data.house.length > 0 ? response.data.house[0].PlanNo : null,
					floors: response.data.house.length > 0 ? response.data.house[0].Floors : null,
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
					rev_no: revision.data ? `${splitRevision[0]}-${secondaryRevision + 1}` : '1-0',
					type_id: '',
					reason_id: '',
					logs: '',
					th_no: th_no ? th_no : null,
					department_id: userInfo.DepartmentCode,
					section_id: userInfo.SectionCode,
					team_id: userInfo.TeamCode,
					updated_by: userInfo.EmployeeCode
				};
			});
		const detailsItem = await fetchDetails(constructionCode);

		if (detailsItem) {
			const fetchStatus = await Http.get(`/api/status/${detailsItem.id}`);
			const productCategories = fetchStatus.data.map((item) => {
				return {
					...item,
					department:
						departments.length > 0
							? departments.find((attr) => {
									const prod = products.data.find(
										(el) =>
											attr.DepartmentCode == el.department_id &&
											item.product_id == el.id
									);

									return prod ? attr.DepartmentCode == prod.department_id : false;
							  })
								? departments.find((attr) => {
										const prod = products.data.find(
											(el) =>
												attr.DepartmentCode == el.department_id &&
												item.product_id == el.id
										);

										return prod
											? attr.DepartmentCode == prod.department_id
											: false;
								  }).DepartmentName
								: null
							: null,
					section:
						sections.length > 0
							? sections.find((attr) => {
									const prod = products.data.find(
										(el) =>
											attr.SectionCode == el.section_id &&
											item.product_id == el.id
									);
									return prod ? attr.SectionCode == prod.section_id : false;
							  })
								? sections.find((attr) => {
										const prod = products.data.find(
											(el) =>
												attr.SectionCode == el.section_id &&
												item.product_id == el.id
										);
										return prod ? attr.SectionCode == prod.section_id : false;
								  }).SectionName
								: null
							: null,
					team:
						teams.length > 0
							? teams.find((attr) => {
									const prod = products.data.find(
										(el) =>
											attr.TeamCode == el.team_id && item.product_id == el.id
									);
									return prod ? attr.TeamCode == prod.team_id : false;
							  })
								? teams.find((attr) => {
										const prod = products.data.find(
											(el) =>
												attr.TeamCode == el.team_id &&
												item.product_id == el.id
										);
										return prod ? attr.TeamCode == prod.team_id : false;
								  }).TeamName
								: null
							: null,
					sequence:
						details.method == '2'
							? products.data.find((el) => el.id == item.product_id).waku_sequence
							: products.data.find((el) => el.id == item.product_id).jiku_sequence,
					product_name: products.data.find((el) => el.id == item.product_id).product_name
				};
			});
			const sortBySequence = _.sortBy(productCategories, ['sequence', 'product_name']);
			setStatus(sortBySequence);
		}
		return 'found';
	};
	return (
		<div id="registration_page" style={{ height: '5%' }}>
			{userInfo.SectionCode == '00465' && userInfo.TeamCode == '00133' ? (
				<>
					<div className="th_plans" />
					<Table
						size="small"
						columns={headers(
							getColumnSearchProps,
							info,
							handleClickPDF,
							handleSelectOption,
							handleOnClickEvent,
							handleInputText
						)}
						loading={loading}
						bordered
						pagination={pagination}
						dataSource={plans}
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
						handleSpecs={handleSpecs}
						handleOnChange={handleOnChange}
						handleRegister={handleRegister}
						henkouInfo={info}
						product={products.data}
						status={henkouStatus}
						details={details}></ManualContainer>
				</>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(Registration);
