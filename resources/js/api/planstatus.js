import React, { useState, useEffect, useLayoutEffect } from 'react';
import Http from '../Http';

export const useActivePlanStatus = () => {
	const [productCategoriesPCMS, setProductCategoriesPCMS] = useState([]);
	useLayoutEffect(() => {
		let mounted = true;
		try {
			(async () => {
				console.log('planstatus');
				const instance = Http.create({
					baseURL: 'http://hrdapps71:4900/',

					// baseURL: 'http://10.168.64.223:4900/',
					withCredentials: false
					// headers: {
					// 	'master-api': 'db588403f0a1d3b897442a28724166b4'
					// }
				});
				const response = await instance.get('get/getProductListActive?from=plugins');
				if (mounted) {
					setProductCategoriesPCMS(response.data);
				}
			})();
		} catch (err) {
			console.error(err);
		}
		return () => {
			mounted = false;
		};
	}, []);
	return [productCategoriesPCMS, setProductCategoriesPCMS];
};

export const getPlanStatusByCustomerCode = async (details, productCategoriesPCMS, rest) => {
	try {
		const instance = Http.create({
			baseURL: 'http://hrdapps68:8070/api',
			// baseURL: 'http://10.168.64.223:4900/',
			withCredentials: false
		});
		// const response = await instance.get('/pcms/active/products');
		// const productCategoriesPCMS = response.data;
		/* PCMS */
		let houseType = details.Method == 1 ? 'Jikugumi' : 'Wakugumi';
		let email = null;
		let tempStat = '';
		let arr = [];
		let temp = {};
		let planDetails = [];
		let pending = '';
		// const responseCheckPlans = await instance.get(`/pcms/plan/${details.ConstructionCode}`);
		// if (responseCheckPlans.data.length > 0) {
		// 	if (responseCheckPlans.data[0].EmailedDate) {
		// 		email = responseCheckPlans.data[0].EmailedDate;
		// 	}
		// 	checkedPlanDetails = {
		// 		KakouIraiRequest: responseCheckPlans.data[0].KakouIraiRequest,
		// 		HouseTypeCode: responseCheckPlans.data[0].HouseTypeCode,
		// 		HouseClass: responseCheckPlans.data[0].HouseClass,
		// 		EmailedDate: email,
		// 		JoutouDate: responseCheckPlans.data[0].JoutouDate,
		// 		ShiageDelivery: responseCheckPlans.data[0].ShiageDelivery,
		// 		KisoStart: responseCheckPlans.data[0].KisoStart
		// 	};
		// } else {
		// 	checkedPlanDetails = {
		// };
		// }
		const responsePlanStatus = await instance.get(
			`/pcms/planstatus/${details.ConstructionCode}`
		);
		for (let i = 0; i < productCategoriesPCMS.length; i++) {
			if (
				houseType == productCategoriesPCMS[i].HouseType ||
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
								Section:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Section
										: null,
								Team:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Team
										: null,
								Sequence: parseInt(
									productCategoriesPCMS[i].ProductSequence[houseType]
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
								Section:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Section
										: null,
								Team:
									productCategoriesPCMS[i].Res.length > 0
										? productCategoriesPCMS[i].Res[0].Team
										: null,
								Sequence: parseInt(
									productCategoriesPCMS[i].ProductSequence[houseType]
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
						Section:
							productCategoriesPCMS[i].Res.length > 0
								? productCategoriesPCMS[i].Res[0].Section
								: null,
						Team:
							productCategoriesPCMS[i].Res.length > 0
								? productCategoriesPCMS[i].Res[0].Team
								: null,
						Sequence: parseInt(productCategoriesPCMS[i].ProductSequence[houseType]),
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
		// let userProducts = [];
		// // setPlanStatus(planDetails);
		// const responseEmployeeProducts = await instance.get(
		// 	`get/getID/${rest.userInfo.EmployeeCode}`
		// );
		// if (responseEmployeeProducts != undefined && responseEmployeeProducts.data.length > 0) {
		// 	// if (
		// 	//     responseEmployeeProducts.data[0].filtering == true &&
		// 	//     responseEmployeeProducts.data[0].filtering != undefined
		// 	// ) {
		// 	userProducts = responseEmployeeProducts.data[0][checkedPlanDetails.HouseClass]
		// 		? responseEmployeeProducts.data[0][checkedPlanDetails.HouseClass]
		// 		: responseEmployeeProducts.data[0].myProducts;
		// 	// }
		// 	if (
		// 		responseEmployeeProducts.data[0].showSubProduct == true &&
		// 		responseEmployeeProducts.data[0].showSubProduct != undefined
		// 	) {
		// 		const showSubProducts = responseEmployeeProducts.data[0].showSubProduct
		// 			? responseEmployeeProducts.data[0].showSubProduct
		// 			: false;
		// 	}
		// }

		/* PCMS */
		// if (userProducts.length > 0) {
		// const assignedProductCategoriesPCMS = planDetails.filter((item) => {
		// 	return userProducts.includes(item.ProductCode);
		// });
		// console.log(assignedProductCategoriesPCMS);
		return Promise.resolve(planDetails);
		// console.log(assignedProductCategoriesPCMS, '@@@#$%^&*(');
		// }
		// if (responseCheckPlans.data.status_code == 500) throw result;
	} catch (error) {
		console.error(error);
		// const { status_code, message } = error.data;
		// const data = {
		// 	status_code,
		// 	message
		// };
		// return data;
	}
};
