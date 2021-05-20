/* Utilities */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Http from '../Http';
/* API */
import { fetchProducts, useProductsRetriever, useAffectedProductsRetriever } from '../api/products';
import { fetchDetails } from '../api/details';

// import { useActivePlanStatus } from '../api/planstatus';
/* Components */
import HenkouContainer from '../components/HenkouComponents/HenkouContainer';
/* Utilities */
import LogsUtils from '../utils/HenkouLogs';
const LogsHelper = new LogsUtils();
const Henkou = ({ title, user }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const [state, setState] = useState({
		plan: {},
		assessment: [],
		products: [],
		logs: [],
		productsByFirstIndex: []
	});

	const handleEvent = async (constructionCode) => {
		const { data, status } = await Http.get(`/api/henkou/plan/details/${constructionCode}`);
		const { Assessment, HenkouPlan, LatestProducts, ProductsByFirstIndexRevision } = data;
		// const assessment = await Http.get('/api/master/assessments');
		// setState((prevState) => ({
		//     ...prevState,
		//     assessment
		// }))
		if (status == 200) {
			// setDetail((prevState) => {
			// 	return {
			// 		...prevState,
			// 		...details
			// 		// plan_status: master.planstatus.find((plan) => plan.id == details.plan_status_id)
			// 		// 	.plan_status_name
			// 	};
			// });
			// const { data: products, status } = await Http.get(
			// 	`/api/henkou/plans/${details.customer_code}/products/${details.id}`
			// );
			// await consolidatedHenkouLogs(details);

			setState((prevState) => ({
				...prevState,
				assessment: Assessment,
				productsByFirstIndex: ProductsByFirstIndexRevision,
				logs: LogsHelper.mergeLogs(ProductsByFirstIndexRevision),
				plan: {
					...prevState.plan,
					...HenkouPlan
				},
				products: LatestProducts
			}));

			// setStatus(products);
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdateWithDetails = async (details, row) => {
		const productsClone = status.filter((item) => item.assessment_id == 1);
		if (row.finished_date) {
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = user.EmployeeCode;

			!row.is_rechecking
				? status[status.findIndex((element) => element.affected_id == row.affected_id) + 1]
						?.received_date
					? null
					: (status[
							status.findIndex((element) => element.affected_id == row.affected_id) +
								1
					  ].received_date = row.finished_date)
				: productsClone[
						productsClone.findIndex(
							(element) => element.affected_id == row.affected_id
						) + 1
				  ]
				? status[
						status.indexOf(
							productsClone[
								productsClone.findIndex(
									(element) => element.affected_id == row.affected_id
								) + 1
							]
						)
				  ]?.received_date
					? null
					: (status[
							status.indexOf(
								productsClone[
									productsClone.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
								]
							)
					  ].received_date = row.finished_date)
				: null;
			const statusClone = [...status];
			setStatus(statusClone);
			if (row.log) {
				// setLogs((prevState) => {
				// 	return [
				// 		...prevState,
				// 		prevState.find((el) => el.id == row.id)
				// 			? prevState.find((el) => el.id == row.id).log
				// 				? false
				// 				: {
				// 						id: row.id,
				// 						log: row.log,
				// 						created_at: row.created_at
				// 				  }
				// 			: {
				// 					id: row.id,
				// 					log: row.log,
				// 					created_at: row.created_at
				// 			  }
				// 	];
				// });

				if (row.sequence > 2) {
					const { data: newProducts, status: statusCode } = await Http.post(
						`/api/status/${details.id}`,
						{
							status,
							updated_by: user.EmployeeCode,
							sectionCode: user.SectionCode,
							details,
							row
						}
					);
					console.log(newProducts, 'newwwwwwwwwwwwwwwwwwwwww');
					if (statusCode == 200) {
						handleEvent(details.customer_code);
						setStatus(newProducts);
					}
				}
			}

			if ([5, 25, 36, 58].indexOf(row.affected_id) == -1) {
				const resUpdate = await Http.post(`/api/status/${details.id}`, [
					statusClone[
						statusClone.findIndex((element) => element.affected_id == row.affected_id)
					],
					row.is_rechecking
						? productsClone[
								productsClone.findIndex(
									(element) => element.affected_id == row.affected_id
								) + 1
						  ]
						: statusClone[
								statusClone.findIndex(
									(element) => element.affected_id == row.affected_id
								) + 1
						  ]
				]);
			} else {
				/* FOR FINAL CHECKING PRODUCT */
				const resUpdate = await Http.post(`/api/status/${details.id}`, {
					products:
						statusClone[
							status.findIndex((element) => element.affected_id == row.affected_id)
						]
				});
			}
		} else {
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = user.EmployeeCode;
			const statusClone = [...status];
			setStatus(statusClone);
			const resUpdate = await Http.post(`/api/status/${details.id}`, {
				products:
					statusClone[
						status.findIndex((element) => element.affected_id == row.affected_id)
					]
			});
		}
		await consolidatedHenkouLogs(details);
	};
	const handleBorrow = async (details, row) => {
		// console.log(row, 'rowzzzzzzzzzzzz');
		if (row.finished_date) {
			// setLogs((prevState) => [
			// 	...prevState,
			// 	{
			// 		log: row.log,
			// 		created_at: row.created_at
			// 	}
			// ]);
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;

			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = user.EmployeeCode;
			status[status.findIndex((element) => element.affected_id == row.affected_id) + 1]
				? (status[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
				  ].received_date = row.finished_date)
				: null;
			const statusClone = [...status];
			setStatus(statusClone);
			if ([5, 25, 36, 58].indexOf(row.affected_id) == -1) {
				const resUpdate = await Http.post(`/api/status/${details.id}`, [
					statusClone[
						status.findIndex((element) => element.affected_id == row.affected_id)
					],
					statusClone[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
					]
				]);
			} else {
				const resUpdate = await Http.post(`/api/status/${details.id}`, {
					products:
						statusClone[
							status.findIndex((element) => element.affected_id == row.affected_id)
						]
				});
			}
		} else {
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = user.EmployeeCode;
			const statusClone = [...status];
			setStatus(statusClone);
			const resUpdate = await Http.post(`/api/status/${details.id}`, {
				products:
					statusClone[
						status.findIndex((element) => element.affected_id == row.affected_id)
					]
			});
		}
		const { data: newProducts, status: statusCode } = await Http.post(
			`/api/status/${details.id}`,
			{
				status,
				updated_by: user.EmployeeCode,
				sectionCode: user.SectionCode,
				details,
				row
			}
		);
		// console.log(newProducts, 'newwwwwwwwwwwwwwwwwwwwww');
		if (statusCode == 200) {
			handleEvent(details.customer_code);
			setStatus(newProducts);
		}
	};
	const handleUpdate = async (details, row, key) => {
		status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
		status[status.findIndex((element) => element.affected_id == row.affected_id)].updated_by =
			user.EmployeeCode;
		const statusClone = [...status];
		setStatus(statusClone);
		if (key == 'finished_date') {
			status[status.findIndex((element) => element.affected_id == row.affected_id) + 1]
				? status[status.findIndex((element) => element.affected_id == row.affected_id) + 1]
						.received_date
					? null
					: (status[
							status.findIndex((element) => element.affected_id == row.affected_id) +
								1
					  ].received_date = row.finished_date)
				: null;
			const statusClone = [...status];
			setStatus(statusClone);
			// if (row.log) {
			// 	setLogs((prevState) => {
			// 		return [
			// 			...prevState,
			// 			prevState.find((el) => el.id == row.id)
			// 				? prevState.find((el) => el.id == row.id).log
			// 					? false
			// 					: {
			// 							id: row.id,
			// 							log: row.log,
			// 							created_at: row.created_at
			// 					  }
			// 				: {
			// 						id: row.id,
			// 						log: row.log,
			// 						created_at: row.created_at
			// 				  }
			// 		];
			// 	});
			// }
			if ([5, 25, 36, 58].indexOf(row.affected_id) == -1) {
				const resUpdate = await Http.post(`/api/status/${details.id}`, [
					status[status.findIndex((element) => element.affected_id == row.affected_id)],
					status[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
					]
				]);
			} else {
				const resUpdate = await Http.post(`/api/status/${details.id}`, {
					products:
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						]
				});
			}
		} else if (key !== 'log') {
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = user.EmployeeCode;

			if (
				status[status.findIndex((element) => element.affected_id == row.affected_id)]
					.assessment_id !== 1
			) {
				status[
					status.findIndex((element) => element.affected_id == row.affected_id) + 1
				].received_date = moment()
					.utc()
					.local()
					.format('YYYY-MM-DD HH:mm:ss');

				const products = [...status];
				setStatus(products);
				const resUpdate = await Http.post(`/api/status/${details.id}`, [
					products[status.findIndex((element) => element.affected_id == row.affected_id)],
					products[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
					]
				]);
			} else {
				const products = [...status];
				setStatus(products);
				const resUpdate = await Http.post(`/api/status/${details.id}`, {
					products:
						products[
							status.findIndex((element) => element.affected_id == row.affected_id)
						]
				});
			}
		}
		setDetail(details);
		// handleEvent(details.customer_code);
	};
	const consolidatedHenkouLogs = async (details) => {
		const [firstDigit, secondDigit] = details?.rev_no.split('-');
		const { data: productsLogs, status: statusCode } = await Http.get(
			`api/henkou/plans/${details.customer_code}/revision/${firstDigit}`
		);
		if (statusCode == 200) {
			const productLogs = productsLogs.map((item) => {
				return {
					...item,
					logs: item.log,
					rev_no: item?.details?.rev_no
				};
			});
			const detailsLogs = productLogs
				.filter(
					(val, id, arr) =>
						arr.findIndex(
							(item) =>
								item.plan.logs === val.plan.logs &&
								item.plan.rev_no === val.plan.rev_no
						) === id
				)
				.map((val) => val.plan);

			const pendingLogs = productLogs
				.map((item) => {
					return item?.pendings;
				})
				.flat(1);
			const henkouLogs = [...detailsLogs, ...productLogs];
			const mergeLogs = [...henkouLogs, ...pendingLogs];
			setLogs(
				mergeLogs
					.map((item) => {
						return {
							...item,
							id: item.id,
							borrow_details: item.borrow_details,
							rev_no: item?.rev_no ? item.rev_no : item?.details?.rev_no,
							product_name: item?.affected_product?.product?.product_name,
							updated_by: item.updated_by,
							log: item.logs,
							created_at: item.created_at
						};
					})
					.sort((a, b) => moment(a.created_at).diff(b.created_at))
			);
		}
	};
	return (
		<HenkouContainer
			// handleEvent={handleEvent}
			// handleUpdate={handleUpdate}
			events={{
				handleEvent,
				handleUpdate,
				handleBorrow,
				consolidatedHenkouLogs,
				handleUpdateWithDetails
			}}
			props={state}
			// product={master.products}
		></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(Henkou);
