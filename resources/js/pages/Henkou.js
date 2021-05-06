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

const Henkou = ({ title, ...rest }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const { master, userInfo } = rest;
	// const [products, setProducts] = useProductsRetriever();
	// const [affectedProducts, setAffectedProducts] = useAffectedProductsRetriever();
	const [details, setDetail] = useState({});
	const [assessment, setAsssessment] = useState([]);
	const [planDetail, setPlanDetail] = useState([]);
	const [status, setStatus] = useState([]);
	const [logs, setLogs] = useState([]);
	const handleEvent = async (constructionCode) => {
		const details = await fetchDetails(constructionCode);
		const assessment = await Http.get('/api/master/assessments');
		setAsssessment(assessment.data);

		if (details) {
			setDetail((prevState) => {
				return {
					...prevState,
					...details,
					plan_status: master.planstatus.find((plan) => plan.id == details.plan_status_id)
						.plan_status_name
				};
			});
			const fetchStatus = await Http.get(
				`/api/henkou/plans/${details.customer_code}/products/${details.id}`
			);
			await consolidatedHenkouLogs(details);
			const mappedProducts = fetchStatus.data.map((item, index) => {
				return {
					...item,
					department:
						master.departments.length > 0
							? master.departments.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
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
								? master.departments.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
						master.sections.length > 0
							? master.sections.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
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
								? master.sections.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
						master.teams.length > 0
							? master.teams.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return (
											attr.TeamCode == el.team_id && el.id == affectedProds
										);
									});
									return prod ? attr.TeamCode == prod.team_id : false;
							  })
								? master.teams.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
							? master.affectedProducts.find((el) => el.id == item.affected_id)
								? master.affectedProducts.find((el) => el.id == item.affected_id)
										.sequence_no
								: null
							: master.affectedProducts.find((el) => el.id == item.affected_id)
							? master.affectedProducts.find((el) => el.id == item.affected_id)
									.sequence_no
							: null,

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
										return affectedProds ? el.id == affectedProds : null;
								  }).product_name
								: null
							: null
				};
			});
			setStatus(mappedProducts);
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdateWithDetails = async (details, row) => {
		if (row.finished_date) {
			status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
			status[
				status.findIndex((element) => element.affected_id == row.affected_id)
			].updated_by = userInfo.EmployeeCode;
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
					const resCreate = await Http.post(`/api/status/${details.id}`, {
						status,
						updated_by: userInfo.EmployeeCode,
						sectionCode: userInfo.SectionCode,
						details,
						row
					});
					handleEvent(details.customer_code);

					setStatus(
						resCreate.data.map((item, index) => {
							return {
								...item,
								status_index: index + 1,
								department:
									master.departments.length > 0
										? master.departments.find((attr) => {
												const prod = master.products.find((el) => {
													const affectedProds = master.affectedProducts.find(
														(el) => el.id == item.affected_id
													)
														? master.affectedProducts.find(
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
										  })
											? master.departments.find((attr) => {
													const prod = master.products.find((el) => {
														const affectedProds = master.affectedProducts.find(
															(el) => el.id == item.affected_id
														)
															? master.affectedProducts.find(
																	(el) =>
																		el.id == item.affected_id
															  ).product_category_id
															: null;
														return (
															attr.DepartmentCode ==
																el.department_id &&
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
									master.sections.length > 0
										? master.sections.find((attr) => {
												const prod = master.products.find((el) => {
													const affectedProds = master.affectedProducts.find(
														(el) => el.id == item.affected_id
													)
														? master.affectedProducts.find(
																(el) => el.id == item.affected_id
														  ).product_category_id
														: null;
													return (
														attr.SectionCode == el.section_id &&
														el.id == affectedProds
													);
												});
												return prod
													? attr.SectionCode == prod.section_id
													: false;
										  })
											? master.sections.find((attr) => {
													const prod = master.products.find((el) => {
														const affectedProds = master.affectedProducts.find(
															(el) => el.id == item.affected_id
														)
															? master.affectedProducts.find(
																	(el) =>
																		el.id == item.affected_id
															  ).product_category_id
															: null;
														return (
															attr.SectionCode == el.section_id &&
															el.id == affectedProds
														);
													});
													return prod
														? attr.SectionCode == prod.section_id
														: false;
											  }).SectionName
											: null
										: null,
								team:
									master.teams.length > 0
										? master.teams.find((attr) => {
												const prod = master.products.find((el) => {
													const affectedProds = master.affectedProducts.find(
														(el) => el.id == item.affected_id
													)
														? master.affectedProducts.find(
																(el) => el.id == item.affected_id
														  ).product_category_id
														: null;
													return (
														attr.TeamCode == el.team_id &&
														el.id == affectedProds
													);
												});
												return prod ? attr.TeamCode == prod.team_id : false;
										  })
											? master.teams.find((attr) => {
													const prod = master.products.find((el) => {
														const affectedProds = master.affectedProducts.find(
															(el) => el.id == item.affected_id
														)
															? master.affectedProducts.find(
																	(el) =>
																		el.id == item.affected_id
															  ).product_category_id
															: null;
														return (
															attr.TeamCode == el.team_id &&
															el.id == affectedProds
														);
													});
													return prod
														? attr.TeamCode == prod.team_id
														: false;
											  }).TeamName
											: null
										: null,
								sequence:
									details.method == '2'
										? master.affectedProducts.find(
												(el) => el.id == item.affected_id
										  )
											? master.affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).sequence_no
											: null
										: master.affectedProducts.find(
												(el) => el.id == item.affected_id
										  )
										? master.affectedProducts.find(
												(el) => el.id == item.affected_id
										  ).sequence_no
										: null,

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
												return affectedProds
													? el.id == affectedProds
													: null;
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
						})
					);
				}
			}

			if ([5, 23, 34, 54].indexOf(row.affected_id) == -1) {
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
			].updated_by = userInfo.EmployeeCode;
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
			].updated_by = userInfo.EmployeeCode;
			status[status.findIndex((element) => element.affected_id == row.affected_id) + 1]
				? (status[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
				  ].received_date = row.finished_date)
				: null;
			const statusClone = [...status];
			setStatus(statusClone);
			if ([5, 23, 34, 54].indexOf(row.affected_id) == -1) {
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
			].updated_by = userInfo.EmployeeCode;
			const statusClone = [...status];
			setStatus(statusClone);
			const resUpdate = await Http.post(`/api/status/${details.id}`, {
				products:
					statusClone[
						status.findIndex((element) => element.affected_id == row.affected_id)
					]
			});
		}
		const resCreate = await Http.post(`/api/status/${details.id}`, {
			status,
			updated_by: userInfo.EmployeeCode,
			sectionCode: userInfo.SectionCode,
			details,
			row
		});
		handleEvent(details.customer_code);
		setStatus(
			resCreate.data.map((item, index) => {
				return {
					...item,
					status_index: index + 1,
					department:
						master.departments.length > 0
							? master.departments.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
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
								? master.departments.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
						master.sections.length > 0
							? master.sections.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
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
								? master.sections.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
						master.teams.length > 0
							? master.teams.find((attr) => {
									const prod = master.products.find((el) => {
										const affectedProds = master.affectedProducts.find(
											(el) => el.id == item.affected_id
										)
											? master.affectedProducts.find(
													(el) => el.id == item.affected_id
											  ).product_category_id
											: null;
										return (
											attr.TeamCode == el.team_id && el.id == affectedProds
										);
									});
									return prod ? attr.TeamCode == prod.team_id : false;
							  })
								? master.teams.find((attr) => {
										const prod = master.products.find((el) => {
											const affectedProds = master.affectedProducts.find(
												(el) => el.id == item.affected_id
											)
												? master.affectedProducts.find(
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
							? master.affectedProducts.find((el) => el.id == item.affected_id)
								? master.affectedProducts.find((el) => el.id == item.affected_id)
										.sequence_no
								: null
							: master.affectedProducts.find((el) => el.id == item.affected_id)
							? master.affectedProducts.find((el) => el.id == item.affected_id)
									.sequence_no
							: null,

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
										return affectedProds ? el.id == affectedProds : null;
								  }).product_name
								: null
							: null
				};
			})
		);
	};
	const handleUpdate = async (details, row, key) => {
		status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
		status[status.findIndex((element) => element.affected_id == row.affected_id)].updated_by =
			userInfo.EmployeeCode;
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
			if ([5, 23, 34, 54].indexOf(row.affected_id) == -1) {
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
			].updated_by = userInfo.EmployeeCode;

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
		// const [firstIndex] = details.rev_no.split('-');
		const [firstDigit, secondDigit] = details ? details.rev_no.split('-') : '';
		const fetchConsolidatedLogs = await Http.get(
			`api/henkou/plans/${details.customer_code}/revision/${firstDigit}`
		);
		// const fetchConsolidatedPendingDetails = await Http.get(
		// 	`/api/henkou/plans/pending/${details.customer_code}`
		// );
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
									return affectedProds ? el.id == affectedProds : null;
							  }).product_name
							: null
						: null
			};
		});
		console.log(productLogs);

		const pendingLogs = fetchConsolidatedLogs.data
			.map((item) => {
				return item.pendings;
			})
			.flat(1)
			.map((item) => {
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
										return affectedProds ? el.id == affectedProds : null;
								  }).product_name
								: null
							: null
				};
			});

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
		const henkouLogs = [
			{
				log: details.logs,
				updated_by: details.updated_by,
				created_at: details.created_at,
				rev_no: details.rev_no
			},
			...productLogs
		];
		console.log(henkouLogs);
		// console.log(henkouLogs);
		const mergeLogs = [...henkouLogs, ...pendingLogs];
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
						log: item.log,
						created_at: item.created_at
					};
				})
				.sort((a, b) => moment(a.created_at).diff(b.created_at))
		);
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
			plandetail={planDetail}
			status={status}
			details={details}
			assessment={assessment}
			logs={logs}
			// product={master.products}
		></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});

export default connect(mapStateToProps)(Henkou);
