/* Utilities */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';
/* API */
import { fetchProducts, useProductsRetriever } from '../api/products';
import { fetchDetails } from '../api/details';
import { useActivePlanStatus } from '../api/planstatus';
/* Components */
import HenkouContainer from '../components/HenkouComponents/HenkouContainer';

const Henkou = ({ title, ...rest }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const [productState, setProduct] = useProductsRetriever();
	const [details, setDetail] = useState({});
	const [assessment, setAsssessment] = useState([]);
	const [planStatus, setPlanStatus] = useActivePlanStatus();
	const [planDetail, setPlanDetail] = useState([]);
	const [userProduct, setUserProducts] = useState([]);
	const [subProduct, setSubProduct] = useState(false);
	const [statusState, setStatus] = useState([]);
	const handleEvent = async (constructionCode) => {
		const details = await fetchDetails(constructionCode);
		const products = await fetchProducts(details);
		const fetchAssessment = await Http.get('/api/assessments');

		setAsssessment(fetchAssessment.data);
		setProduct(products);
		setDetail(details);

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
		for (let i = 0; i < planStatus.length; i++) {
			if (
				checkedPlanDetails.HouseClass == planStatus[i].HouseType ||
				planStatus[i].HouseType == 'Both'
			) {
				let rems = false;
				if (_.includes(_.map(responsePlanStatus.data, 'Product'), planStatus[i]._id)) {
					let a = _.find(responsePlanStatus.data, ['Product', planStatus[i]._id]);
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
						if (planStatus[i]._id != 'aPi@wUk3D') {
							arr.push({
								ProductCode: planStatus[i]._id,
								ProductCategory: planStatus[i].ProductCategory,
								ProductType: planStatus[i].ProductType,
								Department: planStatus[i].Department,
								Section: planStatus[i].Res[0].Section,
								Team: planStatus[i].Res[0].Team,
								Sequence: parseInt(
									planStatus[i].ProductSequence[checkedPlanDetails.HouseClass]
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
								ProductCode: planStatus[i]._id,
								ProductCategory: planStatus[i].ProductCategory,
								ProductType: planStatus[i].ProductType,
								Department: planStatus[i].Department,
								Section: planStatus[i].Res[0].Section,
								Team: planStatus[i].Res[0].Team,
								Sequence: parseInt(
									planStatus[i].ProductSequence[checkedPlanDetails.HouseClass]
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
						ProductCode: planStatus[i]._id,
						ProductCategory: planStatus[i].ProductCategory,
						ProductType: planStatus[i].ProductType,
						Department: planStatus[i].Department,
						Section: planStatus[i].Res[0].Section,
						Team: planStatus[i].Res[0].Team,
						Sequence: parseInt(
							planStatus[i].ProductSequence[checkedPlanDetails.HouseClass]
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
			`get/getID/${rest.userInfo[0].EmployeeCode}`
		);
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
		if (userProducts.length > 0) {
			const assignedPlanDetails = planDetails.filter((item) => {
				return userProducts.includes(item.ProductCode);
			});
			setPlanDetail(assignedPlanDetails);
		}
		/* PCMS */

		if (details) {
			const fetchStatus = await Http.get(`/api/status/${details.id}`);
			console.log(fetchStatus);
			setStatus(fetchStatus.data);
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdate = async (row, details, key) => {
		const { received_date, ...attr } = row;
		console.log(key);
		if (key == 'finish_date') {
			planDetail[row.id - 1] = row;
			planDetail[row.id].received_date = received_date;
		} else {
			planDetail[row.id - 1] = attr;
		}
		const products = [...planDetail];
		let updateStatus;
		if (key == 'finish_date') {
			updateStatus = await Http.post(`/api/status/${details.id}`, [
				products[row.id - 1],
				products[row.id]
			]);
		} else {
			updateStatus = await Http.post(`/api/status/${details.id}`, {
				products: products[row.id - 1]
			});
		}
		setPlanDetail(products);
		setStatus(updateStatus.data);
		setDetail(details);
		// setState({ details: state.details, products: state.products });
	};
	return (
		<HenkouContainer
			handleEvent={handleEvent}
			handleUpdate={handleUpdate}
			plandetail={planDetail}
			status={statusState}
			details={details}
			assessment={assessment}
			products={productState}></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.user
});

export default connect(mapStateToProps)(Henkou);
