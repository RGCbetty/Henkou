/* Utilities */
import React, { useEffect, useState } from 'react';
import Http from '../Http';
import { connect } from 'react-redux';
import Moment from 'moment';
import { isObject, toInteger } from 'lodash';

/* Component */
import RegistrationTable from '../components/RegistrationComponents/RegistrationTable';
import PDFLists from '../components/RegistrationComponents/PDFLists';
import ManualContainer from '../components/RegistrationComponents/ManualContainer';
import { headers } from '../components/RegistrationComponents/THPlansHeader';

/* Material Design */
import { Modal } from 'antd';
import { Select, notification } from 'antd';

/* API */
import { useThPlansRetriever, fetchThPlans } from '../api/TH';
import { useActivePlanStatus } from '../api/planstatus';
import { fetchDetails } from '../api/details';
import { useMasterDetails } from '../api/master';

const Registration = ({ title, ...rest }) => {
	const [info, setInfo] = useMasterDetails();
	const [tableTH, setTable] = useThPlansRetriever();
	const [productCategoriesPCMS, setProductCategoriesPCMS] = useActivePlanStatus();
	const [assignedProductCategoriesPCMS, setPlanDetail] = useState([]);
	const [userProductCategoriesPCMS, setUserProducts] = useState([]);
	const [subProductPCMS, setSubProduct] = useState(false);
	const [henkouStatus, setStatus] = useState([]);
	const { Option } = Select;
	const { plans, pagination, loading } = tableTH;
	const { userInfo } = rest;
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const [isModalVisible, setIsModalVisible] = useState({
		modal: false,
		foundsList: []
	});

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
				withCredentials: false
			});
			const { ConstructionCode, RequestAcceptedDate } = record;
			const response = await instance.get(
				`http://hrdapps36:3100/nodexjloc?searchDate=${Moment(RequestAcceptedDate).format(
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
			if (mounted)
				setTable({
					loading: false,
					plans: henkouPlans,
					pagination: {
						...pagination,
						total: total,
						showTotal: (total) => `Total ${total} items`
						// 200 is mock data, you should read it from server
						// total: data.totalCount,
					}
				});
		} catch (e) {
			if (e) mounted = false;
		}
	};
	const [details, setDetails] = useState({
		customer_code: '',
		house_code: '',
		house_type: '',
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
	const handleRegister = async (details) => {
		const response = await Http.post('/api/details', {
			details,
			planStatus: assignedProductCategoriesPCMS
		});

		if (response.status == 200) {
			openNotificationWithIcon('success');
		}
	};

	const handleSpecs = async (constructionCode) => {
		const response = await Http.get(`/api/plandetails/${constructionCode}`);
		const responseRev = await Http.get(`/api/details/${constructionCode}`);

		const instance = Http.create({
			baseURL: 'http://hrdapps71:4900/',
			withCredentials: false
		});
		/* PCMS */
		let checkedPlanDetails = {};
		let email = null;
		let tempStat = '';
		let arr = [];
		let temp = {};
		let planDetails = [];
		let pending = '';
		const responseCheckPlans = await instance.get(`get/checkPlan/${constructionCode}`);
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
		const responsePlanStatus = await instance.get(`get/viewPlanStatus/${constructionCode}`);
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
								Section: productCategoriesPCMS[i].Res[0].Section,
								Team: productCategoriesPCMS[i].Res[0].Team,
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
								Section: productCategoriesPCMS[i].Res[0].Section,
								Team: productCategoriesPCMS[i].Res[0].Team,
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
						Section: productCategoriesPCMS[i].Res[0].Section,
						Team: productCategoriesPCMS[i].Res[0].Team,
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
		const responseEmployeeProducts = await instance.get(`get/getID/${userInfo.EmployeeCode}`);
		if (responseEmployeeProducts != undefined && responseEmployeeProducts.data.length > 0) {
			// if (
			//     responseEmployeeProducts.data[0].filtering == true &&
			//     responseEmployeeProducts.data[0].filtering != undefined
			// ) {
			userProducts = responseEmployeeProducts.data[0][responseCheckPlans.data[0].HouseClass]
				? responseEmployeeProducts.data[0][responseCheckPlans.data[0].HouseClass]
				: [];
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

		const { plan_specs } = response.data;
		const planSpecs = plan_specs.map((item, index) => {
			let str = '';
			if (item.Menshin !== '0') {
				str += 'Menshin';
			}
			if (item.Gousetsu !== '0') {
				str ? (str += ',Gousetsu') : (str += 'Gousetsu');
			}
			if (item.CY !== '0') {
				str ? (str += ',CY') : (str += 'CY');
			}
			if (item['3Storey'] !== '0') {
				str ? (str += ',3Storey') : (str += '3Storey');
			}
			return str;
		});

		let splitRevision = responseRev.data ? responseRev.data.rev_no.split('-') : '';
		let secondaryRevision = toInteger(splitRevision[1]);
		setDetails({
			customer_code: constructionCode,
			house_code: response.data.house[0].NameCode,
			house_type: response.data.house[0].ConstructionTypeName,
			plan_no: response.data.house[0].PlanNo,
			floors: response.data.house[0].Floors,
			joutou_date: response.data.construction_schedule[0].ExpectedHouseRaisingDate,
			days_before_joutou: '',
			kiso_start: response.data.construction_schedule[0].StartedFoundationWorkDate,
			before_kiso_start: '',
			dodai_invoice: response.data.invoice[0].InvoiceDodai,
			['1F_panel_invoice']: response.data.invoice[0].InvoicePanel,
			['1F_hari_invoice']: response.data.invoice[0].Invoice1FHari,
			['1F_iq_invoice']: response.data.invoice[0].Invoice1FIQ,
			plan_specification: planSpecs.join(),
			existing_rev_no: responseRev.data.rev_no,
			rev_no: responseRev.data ? `${splitRevision[0]}-${secondaryRevision + 1}` : '1-0',
			type_id: '',
			reason_id: '',
			logs: '',
			th_no: null,
			department_id: userInfo.DepartmentCode,
			section_id: userInfo.SectionCode,
			team_id: userInfo.TeamCode,
			updated_by: userInfo.EmployeeCode
		});
		if (userProducts.length > 0) {
			const assignedProductCategoriesPCMS = planDetails.filter((item) => {
				return userProducts.includes(item.ProductCode);
			});
			const detailsItem = await fetchDetails(constructionCode);
			if (detailsItem) {
				const fetchStatus = await Http.get(`/api/status/${detailsItem.id}`);
				setStatus(fetchStatus.data);
			}
			setPlanDetail(assignedProductCategoriesPCMS);
		}
	};
	return (
		<div style={{ height: '5%' }}>
			{userInfo.SectionCode == '00465' && userInfo.TeamCode == '00133' ? (
				<>
					<RegistrationTable
						loading={loading}
						headers={headers(handleClickPDF)}
						plans={plans}
						pagination={pagination}
						event={handleTableChange}></RegistrationTable>
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
						productCategoryPCMS={productCategoriesPCMS}
						status={henkouStatus}
						details={details}
						planStatusPCMS={assignedProductCategoriesPCMS}></ManualContainer>
				</>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.user[0]
});

export default connect(mapStateToProps)(Registration);
