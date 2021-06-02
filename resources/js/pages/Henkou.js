/* Utilities */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Http from '../Http';

/* Components */
import HenkouContainer from '../components/HenkouComponents/HenkouContainer';
import { isEqual } from 'lodash';
import durationAsString from '../utils/diffDate';
/* Utilities */

const Henkou = ({ title, user }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const [state, setState] = useState({
		plan: {},
		assessment: [],
		products: [],
		logs: [],
		productsByFirstIndex: [],
		fetchingProducts: false
	});
	const { products, plan, productsByFirstIndex, fetchingProducts } = state;
	console.log(fetchingProducts);

	const handleEvent = async (constructionCode) => {
		const { data, status } = await Http.get(`/api/henkou/plan/details/${constructionCode}`);
		const { Assessment, HenkouPlan, ProductsByFirstIndexRevision } = data;

		if (status == 200) {
			setState((prevState) => ({
				...prevState,
				assessment: Assessment,
				productsByFirstIndex: ProductsByFirstIndexRevision,
				logs: consolidatedHenkouLogs(ProductsByFirstIndexRevision),
				plan: {
					...prevState.plan,
					...HenkouPlan
				}
				// products: LatestProducts
			}));

			return 'found';
		} else {
			return 'not found';
		}
	};
	console;
	const handleUpdateProduct = async (record) => {
		// console.log(record);
		setState((prevState) => ({ ...prevState, fetchingProducts: true }));

		const productIndex = productsByFirstIndex.findIndex((item) => item.id == record.id);
		// console.log(productsByFirstIndex);
		// console.log(productsByFirstIndex[productIndex]);

		const affectedProducts = productsByFirstIndex.filter((item) => item.assessment_id == 1);
		const affectedProductIndex = affectedProducts.findIndex((item) => item.id == record.id);

		productsByFirstIndex[productIndex] = record;
		productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;
		if (record.finished_date) {
			// productsByFirstIndex[productIndex] = record;
			// productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;

			!record.is_rechecking
				? productsByFirstIndex[productIndex + 1]?.received_date
					? null
					: (productsByFirstIndex[productIndex + 1].received_date = record.finished_date)
				: affectedProducts[affectedProductIndex + 1]
				? productsByFirstIndex[
						productsByFirstIndex.indexOf(affectedProducts[affectedProductIndex + 1])
				  ]?.received_date
					? null
					: (productsByFirstIndex[
							productsByFirstIndex.indexOf(affectedProducts[affectedProductIndex + 1])
					  ].received_date = record.finished_date)
				: null;
			// console.log(affectedProducts);
			console.log(affectedProducts[affectedProductIndex + 1]);
			// console.log(affectedProducts[productIndex]);
			setState((prevState) => ({ ...prevState, productsByFirstIndex }));
			if ([5, 25, 36, 58].indexOf(record.affected_id) == -1) {
				const {
					data
				} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
					productsByFirstIndex[productIndex],
					record.is_rechecking
						? affectedProducts[affectedProductIndex + 1]
						: productsByFirstIndex[productIndex + 1]
				]);
				setState((prevState) => ({
					...prevState,
					productsByFirstIndex: data,
					fetchingProducts: false
				}));
				// const { status } = await Http.post(`/api/status/${record.plan_id}`, [
				// 	productsByFirstIndex[productIndex],
				// 	record.is_rechecking
				// 		? affectedProducts[productIndex + 1]
				// 		: productsByFirstIndex[productIndex + 1]
				// ]);
				// if (status == 200) {
				// 	handleEvent(plan.customer_code);
				// }
			} else {
				/* FOR FINAL CHECKING PRODUCT */
				// const { status } = await Http.post(`/api/status/${record.plan_id}`, [
				// 	productsByFirstIndex[productIndex + 1]
				// ]);
				// console.log(productsByFirstIndex[productIndex]);
				const {
					data
				} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
					productsByFirstIndex[productIndex]
				]);
				setState((prevState) => ({
					...prevState,
					productsByFirstIndex: data,
					fetchingProducts: false
				}));
				// if (status == 200) {
				// 	handleEvent(plan.customer_code);
				// }
			}
			if (record.log) {
				if (record.affected_product.sequence_no > 2) {
					const { data: updatedHenkou, status: statusCode } = await Http.post(
						`/api/status/${record.plan_id}`,
						{
							products: productsByFirstIndex.filter(
								(item) => item.rev_no == record.rev_no
							),
							updated_by: user.EmployeeCode,
							sectionCode: user.SectionCode,
							details: plan,
							row: record
						}
					);

					if (statusCode == 200) {
						setState((prevState) => ({
							...prevState,
							productsByFirstIndex: updatedHenkou.products,
							fetchingProducts: true,
							logs: consolidatedHenkouLogs(updatedHenkou.products),
							plan: {
								...prevState.plan,
								...updatedHenkou.details
							}
						}));
					}
				}
			}
		} else {
			// productsByFirstIndex[productIndex] = record;
			// productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;
			const clonedProducts = [...productsByFirstIndex];
			console.log(clonedProducts, 'huwhaaaaaaaaat');
			setState((prevState) => ({
				...prevState,
				// products,
				productsByFirstIndex: clonedProducts
			}));
			const {
				data
			} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
				clonedProducts[productIndex]
			]);
			setState((prevState) => ({
				...prevState,
				productsByFirstIndex: data,
				fetchingProducts: false
			}));
			// const { status } = await Http.post(`/api/status/${record.plan_id}`, [
			// 	clonedProducts[productIndex]
			// ]);
			// if (status == 200) {
			// 	handleEvent(plan.customer_code);
			// }
		}
		// handleEvent(plan.customer_code);

		// await consolidatedHenkouLogs(details);
	};
	const handleBorrow = async (record) => {
		setState((prevState) => ({
			...prevState,
			fetchingProducts: true
		}));
		// const productIndex = productsByFirstIndex.findIndex((item) => item.id == record.id);
		// if (record.finished_date) {
		// 	productsByFirstIndex[productIndex] = record;
		// 	// productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;
		// 	productsByFirstIndex[productIndex + 1]
		// 		? (productsByFirstIndex[productIndex + 1].received_date = record.finished_date)
		// 		: null;
		// 	const clonedProducts = [...productsByFirstIndex];
		// 	setState((prevState) => ({ ...prevState, productsByFirstIndex: clonedProducts }));
		// 	if ([5, 25, 36, 58].indexOf(record.affected_id) == -1) {
		// 		// const resUpdate = await Http.post(`/api/status/${record.plan_id}`, [
		// 		// 	clonedProducts[productIndex],
		// 		// 	clonedProducts[productIndex + 1]
		// 		// ]);
		// 		const {
		// 			data
		// 		} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
		// 			clonedProducts[productIndex],
		// 			clonedProducts[productIndex + 1]
		// 		]);
		// 		setState((prevState) => ({
		// 			...prevState,
		// 			productsByFirstIndex: data,
		// 			fetchingProducts: false
		// 		}));
		// 	} else {
		// 		const {
		// 			data
		// 		} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
		// 			productsByFirstIndex[productIndex]
		// 		]);
		// 		setState((prevState) => ({
		// 			...prevState,
		// 			productsByFirstIndex: data,
		// 			fetchingProducts: false
		// 		}));

		// 		// const resUpdate = await Http.post(`/api/status/${record.plan_id}`, [
		// 		// 	clonedProducts[productIndex]
		// 		// ]);
		// 	}
		// } else {
		// 	productsByFirstIndex[productIndex] = record;
		// 	productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;
		// 	setState((prevState) => ({ ...prevState, productsByFirstIndex }));
		// 	// const resUpdate = await Http.post(`/api/status/${record.plan_id}`, [
		// 	// 	products[productIndex]
		// 	// ]);
		// 	const {
		// 		data
		// 	} = await Http.patch(`api/henkou/plan/${record.plan_id}/product/${record.id}`, [
		// 		productsByFirstIndex[productIndex]
		// 	]);
		// 	setState((prevState) => ({
		// 		...prevState,
		// 		productsByFirstIndex: data,
		// 		fetchingProducts: false
		// 	}));
		// }
		const { data: updatedHenkou, status: statusCode } = await Http.post(
			`/api/status/${record.plan_id}`,
			{
				products: productsByFirstIndex.filter((item) => item.rev_no == record.rev_no),
				updated_by: user.EmployeeCode,
				sectionCode: user.SectionCode,
				details: plan,
				row: record
			}
		);
		// console.log(newProducts, 'newwwwwwwwwwwwwwwwwwwwww');
		if (statusCode == 200) {
			// handleEvent(record.customer_code);
			setState((prevState) => ({
				...prevState,
				productsByFirstIndex: updatedHenkou.products,
				fetchingProducts: false,
				logs: consolidatedHenkouLogs(updatedHenkou.products),
				plan: {
					...prevState.plan,
					...updatedHenkou.details
				}
			}));
		}
	};
	const handleUpdateAssessment = async (record) => {
		setState((prevState) => ({ ...prevState, fetchingProducts: true }));
		const productIndex = productsByFirstIndex.findIndex((item) => item.id == record.id);
		// console.log(record, 'recorddddddddddddddddddd');
		// console.log(productsByFirstIndex[productIndex], 'wopppppppppppp');
		productsByFirstIndex[productIndex] = record;
		productsByFirstIndex[productIndex].updated_by = user.EmployeeCode;
		// setState((prevState) => ({ ...prevState, productsByFirstIndex }));
		const { data } = await Http.patch(
			`api/henkou/plan/${record.plan_id}/product/${record.id}`,
			[productsByFirstIndex[productIndex]]
		);
		setState((prevState) => ({
			...prevState,
			productsByFirstIndex: data,
			fetchingProducts: false
		}));
		// setState((prevState) => ({
		// 	...prevState,
		// 	productsByFirstIndex: data,
		// }));
		// handleEvent(plan.customer_code);
	};
	const consolidatedHenkouLogs = (products) => {
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
				return item.pendings.map((obj) => ({
					...obj,
					product_category: item.affected_product.product_category
				}));
			})
			.flat(1);
		const henkouLogs = [...detailsLogs, ...productLogs];
		const mergeLogs = [...henkouLogs, ...pendingLogs];
		return mergeLogs
			.map((item) => {
				return {
					...item,
					id: item.id,
					borrow_details: item.borrow_details,
					rev_no: item.rev_no,
					product_name:
						item?.affected_product?.product_category.product_name ||
						item?.product_category?.product_name,
					updated_by: item.updated_by,
					log: item.logs || item.log,
					created_at: item.created_at
				};
			})
			.sort((a, b) => moment(a.created_at).diff(b.created_at));
	};
	return (
		<HenkouContainer
			events={{
				handleEvent,
				handleUpdateAssessment,
				handleBorrow,
				consolidatedHenkouLogs,
				handleUpdateProduct
			}}
			props={state}
			// product={master.products}x
		></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(Henkou);
