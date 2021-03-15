/* Utilities */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';
/* API */
import { fetchProducts, useProductsRetriever, useAffectedProductsRetriever } from '../api/products';
import { fetchDetails } from '../api/details';
import {
	useMasterCompany,
	useMasterSection,
	useMasterDepartment,
	useMasterTeam
} from '../api/master';
// import { useActivePlanStatus } from '../api/planstatus';
/* Components */
import HenkouContainer from '../components/HenkouComponents/HenkouContainer';

const Henkou = ({ title, ...rest }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const [products, setProducts] = useProductsRetriever();
	const [affectedProducts, setAffectedProducts] = useAffectedProductsRetriever();
	const [departments, setDepartments] = useMasterDepartment();
	const [sections, setSections] = useMasterSection();
	const [teams, setTeams] = useMasterTeam();
	const [company, setCompany] = useMasterCompany();
	const [details, setDetail] = useState({});
	const [assessment, setAsssessment] = useState([]);
	const [planDetail, setPlanDetail] = useState([]);
	const [status, setStatus] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const handleEvent = async (constructionCode) => {
		const details = await fetchDetails(constructionCode);
		const assessment = await Http.get('/api/assessments');
		console.log(details);
		setAsssessment(assessment.data);
		setDetail(details);
		if (details) {
			const fetchStatus = await Http.get(`/api/status/${details.id}`);
			console.log(fetchStatus);
			const mappedProducts = fetchStatus.data.map((item) => {
				return {
					...item,
					department:
						departments.length > 0
							? departments.find((attr) => {
									const prod = products.data.find((el) => {
										const affectedProds = affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return (
											attr.DepartmentCode == el.department_id &&
											el.id == affectedProds
										);
									});
									return prod ? attr.DepartmentCode == prod.department_id : false;
							  })
								? departments.find((attr) => {
										const prod = products.data.find((el) => {
											const affectedProds = affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? affectedProducts.find(
														(el) => el.id == item.affected_id
												  ).product_category_id
												: null;
											return (
												attr.DepartmentCode == el.department_id &&
												el.id == affectedProds
											);
										});
										return prod
											? attr.DepartmentCode == prod.department_id
											: false;
								  }).DepartmentName
								: null
							: null,
					section:
						sections.length > 0
							? sections.find((attr) => {
									const prod = products.data.find((el) => {
										const affectedProds = affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return (
											attr.SectionCode == el.section_id &&
											el.id == affectedProds
										);
									});
									return prod ? attr.SectionCode == prod.section_id : false;
							  })
								? sections.find((attr) => {
										const prod = products.data.find((el) => {
											const affectedProds = affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? affectedProducts.find(
														(el) => el.id == item.affected_id
												  ).product_category_id
												: null;
											return (
												attr.SectionCode == el.section_id &&
												el.id == affectedProds
											);
										});
										return prod ? attr.SectionCode == prod.section_id : false;
								  }).SectionName
								: null
							: null,
					team:
						teams.length > 0
							? teams.find((attr) => {
									const prod = products.data.find((el) => {
										const affectedProds = affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return (
											attr.TeamCode == el.team_id && el.id == affectedProds
										);
									});
									return prod ? attr.TeamCode == prod.team_id : false;
							  })
								? teams.find((attr) => {
										const prod = products.data.find((el) => {
											const affectedProds = affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? affectedProducts.find(
														(el) => el.id == item.affected_id
												  ).product_category_id
												: null;
											return (
												attr.TeamCode == el.team_id &&
												el.id == affectedProds
											);
										});
										return prod ? attr.TeamCode == prod.team_id : false;
								  }).TeamName
								: null
							: null,
					sequence:
						details.method == '2'
							? affectedProducts.find((el) => el.id == item.affected_id)
								? affectedProducts.find((el) => el.id == item.affected_id)
										.sequence_no
								: null
							: affectedProducts.find((el) => el.id == item.affected_id)
							? affectedProducts.find((el) => el.id == item.affected_id).sequence_no
							: null,

					product_name:
						products.data.length > 0
							? products.data.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return affectedProds ? el.id == affectedProds : null;
							  })
								? products.data.find((el) => {
										const affectedProds = affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return affectedProds ? el.id == affectedProds : null;
								  }).product_name
								: null
							: null
				};
			});
			// const owner = mappedProducts.filter((item, index) => {
			// 	if (rest.userInfo.DesignationCode == '003') {
			// 		if (
			// 			rest.userInfo.DepartmentCode ==
			// 				products.data.find((el) => el.id == item.product_id).department_id &&
			// 			rest.userInfo.SectionCode ==
			// 				products.data.find((el) => el.id == item.product_id).section_id
			// 		) {
			// 			return item;
			// 		}
			// 	} else {
			// 		if (
			// 			rest.userInfo.DepartmentCode ==
			// 				products.data.find((el) => el.id == item.product_id).department_id &&
			// 			rest.userInfo.SectionCode ==
			// 				products.data.find((el) => el.id == item.product_id).section_id &&
			// 			rest.userInfo.TeamCode ==
			// 				products.data.find((el) => el.id == item.product_id).team_id
			// 		) {
			// 			return item;
			// 		}
			// 	}
			// });
			// console.log(owner, 'cqwrijqcwoirjqwoicrjqw');
			// const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
			// let params = {};
			// for (let i = 0; i < sortBySequenceOwner.length; i++) {
			// 	params[`product_${i + 1}`] = owner[i].product_key;
			// }
			// console.log(params, 'paramssssssss');
			// const supplierKeys = await Http.get(`api/supplier`, { params: params });
			// const suppliersWithProductDetails = supplierKeys.data.map((item) => {
			// 	return {
			// 		...item,
			// 		products:
			// 			mappedProducts.length > 0
			// 				? mappedProducts.filter((el) => {
			// 						return el.product_key == item.supplier_key;
			// 				  })
			// 				: null
			// 	};
			// });
			// console.log(suppliersWithProductDetails, 'testsetsetestsetset');
			// console.log(supplierKeys, 'suppllierrsss!!!!!!!!!!!!!');

			// let concatenatedProducts = [];
			// let tempSuppliers = [];
			// console.log(sortBySequenceOwner, 'sortedOwner');
			// for (let i = 0; i < sortBySequenceOwner.length; i++) {
			// 	console.log(sortBySequenceOwner[i], 'each Ownerrrrrrrrrrr');
			// 	for (let j = 0; j < suppliersWithProductDetails.length; j++) {
			// 		if (
			// 			sortBySequenceOwner[i].product_key ==
			// 			suppliersWithProductDetails[j].product_key
			// 		) {
			// 			for (let k = 0; k < suppliersWithProductDetails[j].products.length; k++) {
			// 				console.log(suppliersWithProductDetails[j].products[k]);
			// 				suppliersWithProductDetails[j].products[k]['last_touch'] =
			// 					suppliersWithProductDetails[j].last_touch;
			// 				tempSuppliers.push(suppliersWithProductDetails[j].products[k]);
			// 				suppliers.push(suppliersWithProductDetails[j].products[k]);
			// 			}
			// 		}
			// 	}
			// 	const sortedSupplier = _.sortBy(tempSuppliers, ['sequence', 'product_name']);
			// 	for (let l = 0; l < sortedSupplier.length; l++) {
			// 		concatenatedProducts.push(sortedSupplier[l]);
			// 	}
			// 	tempSuppliers = [];
			// 	concatenatedProducts.push(sortBySequenceOwner[i]);
			// }
			// setSuppliers(supplierKeys.data);
			// const uniqueProducts = _.uniqBy(concatenatedProducts, (obj) => obj.product_key);
			// // setUniqueProducts(uniqueProducts);
			// console.log(concatenatedProducts, 'concatenated products!!!!!!!!!!!!');
			setStatus(mappedProducts);

			if (details.method == '2') {
				const sortedProducts = _.sortBy(products.data, ['waku_sequence', 'product_name']);
				setProducts(sortedProducts);
			} else {
				const sortedProducts = _.sortBy(products.data, ['jiku_sequence', 'product_name']);
				setProducts(sortedProducts);
			}
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdate = async (row, details, key) => {
		const { received_date, product_key, detail_id, ...attr } = row;

		if (key == 'finished_date') {
			status[status.findIndex((element) => element.product_id == row.product_id)] = row;
			status[
				status.findIndex((element) => element.product_id == row.product_id) + 1
			].received_date = received_date;
		} else {
			status[status.findIndex((element) => element.product_id == row.product_id)] = row;
		}
		const products = [...status];
		let updateStatus;
		if (key == 'finished_date') {
			updateStatus = await Http.post(`/api/status/${details.id}`, [
				products[status.findIndex((element) => element.product_id == row.product_id)],
				products[status.findIndex((element) => element.product_id == row.product_id) + 1]
			]);
		} else {
			updateStatus = await Http.post(`/api/status/${details.id}`, {
				products:
					products[status.findIndex((element) => element.product_id == row.product_id)]
			});
		}
		// setProduct(products);
		setStatus(products);
		setDetail(details);
		// setState({ details: state.details, products: state.products });
	};
	return (
		<HenkouContainer
			handleEvent={handleEvent}
			handleUpdate={handleUpdate}
			plandetail={planDetail}
			suppliers={suppliers}
			status={status}
			details={details}
			company={company}
			assessment={assessment}
			product={products.data}
			affectedProducts={affectedProducts}></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(Henkou);
