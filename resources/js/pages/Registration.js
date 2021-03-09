/* Utilities */
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Http from '../Http';
import { connect } from 'react-redux';
import moment from 'moment';
import { isObject, toInteger } from 'lodash';

/* Component */
import PDFLists from '../components/RegistrationComponents/PDFLists';
import ManualContainer from '../components/RegistrationComponents/ManualContainer';
import { headers } from '../components/RegistrationComponents/THPlansHeader';

/* Material Design */
import { Modal, notification, Table } from 'antd';

/* API */
import { useThPlansRetriever, fetchThPlans, useTempThRetriever } from '../api/TH';
import { useActivePlanStatus } from '../api/planstatus';
import { fetchDetails } from '../api/details';
import { useMasterDetails, useMasterCompany } from '../api/master';
import { useProductsRetriever } from '../api/products';

const Registration = ({ title, ...rest }) => {
	const { userInfo } = rest;
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const [info, setInfo] = useMasterDetails();
	const [company, setCompany] = useMasterCompany();
	const [tableTH, setTable] = useThPlansRetriever(userInfo);
	const [tempTh, setTempTh] = useTempThRetriever();
	const [product, setProduct] = useProductsRetriever();
	const [henkouStatus, setStatus] = useState([]);
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
	const firstUpdate = useRef(true);
	useLayoutEffect(() => {
		if (!firstUpdate.current) {
			firstUpdate.current = false;
			console.log(details);
		}
	}, [details]);
	const { plans, pagination, loading } = tableTH;

	// const showModal = () => {
	//     setIsModalVisible(true);
	// };
	const handleOk = () => {
		setIsModalVisible({ modal: false, foundsList: [] });
	};

	const handleCancel = () => {
		setIsModalVisible({ modal: false, foundsList: [] });
	};

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
			const response = await fetchThPlans(setTable, page);
			const { henkouPlans, pagination, total } = await response;
			const THplans = henkouPlans.map((item, index) => {
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
						: null
				};
			});
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
		if (details.method == '2') {
			const owner = product.data.filter((item, index) => {
				if (
					rest.userInfo.DepartmentCode == item.department_id &&
					rest.userInfo.SectionCode == item.section_id &&
					rest.userInfo.TeamCode == item.team_id
				) {
					return item;
				}
			});

			const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
			let params = {};
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				params[`product_${i + 1}`] = owner[i].product_key;
			}
			const customerKey = await Http.get(`api/customer`, { params: params });
			const customers = customerKey.data.map((item) => {
				return {
					...item,
					products:
						product.data.length > 0
							? product.data.filter((el) => {
									return el.product_key == item.customer_key;
							  })
							: null
				};
			});

			let customer = [];
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				for (let j = 0; j < customers.length; j++) {
					if (sortBySequenceOwner[i].product_key == customers[j].product_key) {
						for (let k = 0; k < customers[j].products.length; k++) {
							customer.push(customers[j].products[k]);
						}
					}
				}
			}
			const products = product.data.map((item, index) => {
				if (
					customer.find((el) => {
						return el.id == item.id;
					})
				) {
					return {
						...item,
						remarks: row ? row.remarks : null,
						received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				}
				if (
					rest.userInfo.DepartmentCode == item.department_id &&
					rest.userInfo.SectionCode == item.section_id &&
					rest.userInfo.TeamCode == item.team_id
				) {
					return {
						...item,
						remarks: row ? row.remarks : null,
						received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				}
				return item;
			});
			const sortedProducts = _.sortBy(products, ['waku_sequence', 'product_name']);
			const response = await Http.post('/api/details', {
				details,
				product: sortedProducts
			});
			if (response.status == 200) {
				openNotificationWithIcon('success');
			}
			setProduct(sortedProducts);
		} else {
			const owner = product.data.filter((item, index) => {
				if (
					rest.userInfo.DepartmentCode == item.department_id &&
					rest.userInfo.SectionCode == item.section_id &&
					rest.userInfo.TeamCode == item.team_id
				) {
					return item;
				}
			});

			const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
			let params = {};
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				params[`product_${i + 1}`] = owner[i].product_key;
			}
			const customerKey = await Http.get(`api/customer`, { params: params });
			const customers = customerKey.data.map((item) => {
				return {
					...item,
					products:
						product.data.length > 0
							? product.data.filter((el) => {
									return el.product_key == item.customer_key;
							  })
							: null
				};
			});

			let customer = [];
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				for (let j = 0; j < customers.length; j++) {
					if (sortBySequenceOwner[i].product_key == customers[j].product_key) {
						for (let k = 0; k < customers[j].products.length; k++) {
							customer.push(customers[j].products[k]);
						}
					}
				}
			}
			const products = product.data.map((item, index) => {
				if (
					customer.find((el) => {
						return el.id == item.id;
					})
				) {
					return {
						...item,
						remarks: row.remarks,
						received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				}
				if (
					rest.userInfo.DepartmentCode == item.department_id &&
					rest.userInfo.SectionCode == item.section_id &&
					rest.userInfo.TeamCode == item.team_id
				) {
					return {
						...item,
						remarks: row ? row.remarks : null,
						received_date: moment().format('YYYY-MM-DD HH:mm:ss'),
						finished_date: row ? row.finished_date : null,
						start_date: row ? row.start_date : null,
						finished_date: row ? row.finished_date : null
					};
				}
				return item;
			});
			const sortedProducts = _.sortBy(products, ['jiku_sequence', 'product_name']);
			const response = await Http.post('/api/details', {
				details,
				product: sortedProducts
			});
			if (response.status == 200) {
				openNotificationWithIcon('success');
			}
			setProduct(sortedProducts);
		}
	};
	/* TH Actions */
	const handleOnClickEvent = async (row, key = null) => {
		row[key] = moment().format('YYYY-MM-DD HH:mm:ss');
		if (key == 'finished_date') {
			row.daysinprocess = moment(row.start_date).diff(row.finished_date, 'days');
		}
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
		console.log(response);
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
		console.log(row);
		const response = await Http.post('/api/th/plan', row);

		if (key == 'th_action_id') {
			if (val == 4) {
				await handleRegister(details, row);
			}
		}
		await handleSpecs(row.ConstructionCode, row.RequestNo);
	};
	/* TH Actions */
	const handleSpecs = async (constructionCode, th_no = null) => {
		const response = await Http.get(`/api/plandetails/${constructionCode}`);
		const revision = await Http.get(`/api/details/${constructionCode}`);
		console.log(response);
		const { plan_specs } = response.data;
		let plan_specification = [];
		for (let i = 0; i < plan_specs.length; i++) {
			for (const property in plan_specs[i]) {
				console.log(plan_specs[i]);
				if (plan_specs[i][property] !== '0') {
					plan_specification.push(property);
				}
			}
		}
		console.log(plan_specification);
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
						company.length > 0
							? company.find((attr) => {
									const prod = product.data.find(
										(el) =>
											attr.DepartmentCode == el.department_id &&
											item.product_id == el.id
									);

									return prod ? attr.DepartmentCode == prod.department_id : false;
							  }).DepartmentName
							: null,
					section:
						company.length > 0
							? company.find((attr) => {
									const prod = product.data.find(
										(el) =>
											attr.SectionCode == el.section_id &&
											item.product_id == el.id
									);
									return prod ? attr.SectionCode == prod.section_id : false;
							  }).SectionName
							: null,
					team:
						company.length > 0
							? company.find((attr) => {
									const prod = product.data.find(
										(el) =>
											attr.TeamCode == el.team_id && item.product_id == el.id
									);
									return prod ? attr.TeamCode == prod.team_id : false;
							  }).TeamName
							: null,
					sequence:
						details.method == '2'
							? product.data.find((el) => el.id == item.product_id).waku_sequence
							: product.data.find((el) => el.id == item.product_id).jiku_sequence,
					product_name: product.data.find((el) => el.id == item.product_id).product_name
				};
			});
			const sortBySequence = _.sortBy(productCategories, ['sequence', 'product_name']);
			setStatus(sortBySequence);
		}
		return 'found';
	};
	return (
		<div id="registration_page" style={{ height: '5%' }}>
			{userInfo.SectionCode == '465' && userInfo.TeamCode == '0133' ? (
				<>
					<div className="th_plans" />
					<Table
						size="small"
						columns={headers(
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
						product={product.data}
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
