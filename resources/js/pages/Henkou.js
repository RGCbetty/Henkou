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
	console.log('henkou render');
	const [assessment, setAsssessment] = useState([]);
	const [planDetail, setPlanDetail] = useState([]);
	const [status, setStatus] = useState([]);
	const [logs, setLogs] = useState([]);
	const handleEvent = async (constructionCode) => {
		const details = await fetchDetails(constructionCode);
		const assessment = await Http.get('/api/assessments');
		setAsssessment(assessment.data);
		setDetail(details);
		if (details) {
			const fetchStatus = await Http.get(`/api/status/${details.id}`);
			const fetchConsolidatedLogs = await Http.get(`/api/statuses/${details.id}`);
			setLogs(
				fetchConsolidatedLogs.data
					.map((item) => {
						return { id: item.id, log: item.log, updated_at: item.updated_at };
					})
					.sort((a, b) => moment(a.updated_at).diff(b.updated_at))
			);
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

			// if (details.method == '2') {
			// 	const sortedProducts = _.sortBy(master.products, ['waku_sequence', 'product_name']);
			// 	setProducts({ ...products, data: sortedProducts });
			// } else {
			// 	const sortedProducts = _.sortBy(master.products, ['jiku_sequence', 'product_name']);
			// 	setProducts({ ...products, data: sortedProducts });
			// }
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdate = async (details, row, key = null, pendingItems = null) => {
		// const { received_date, product_key, detail_id, ...attr } = row;
		if (!key) {
			if (pendingItems) {
				if (
					pendingItems.some(
						(row) => row.reason.match(/borrow form/gi) && !row.pending_id
					) ||
					pendingItems.some((row) => row.reason.match(/borrow/gi) && !row.pending_id)
				) {
					if (row.finished_date) {
						setLogs((prevState) => [
							...prevState,
							{ log: row.log, updated_at: moment().format('YYYY-MM-DD, h:mm:ss a') }
						]);
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						] = row;

						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						].updated_by = userInfo.EmployeeCode;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id) +
								1
						]
							? (status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
							  ].received_date = row.finished_date)
							: null;
						const statusClone = [...status];
						setStatus(statusClone);
						if ([5, 23, 35, 55].indexOf(row.affected_id) == -1) {
							if (row.log && row.sequence <= 2) {
								const resUpdate = await Http.post(`/api/status/${details.id}`, [
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									],
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										) + 1
									]
								]);
							} else if (!row.log && row.sequence > 2) {
								const resUpdate = await Http.post(`/api/status/${details.id}`, [
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									],
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										) + 1
									]
								]);
							}
						} else {
							const resUpdate = await Http.post(`/api/status/${details.id}`, {
								products:
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									]
							});
						}
						// const fetchConsolidatedLogs = await Http.get(`/api/statuses/${details.id}`);
					} else {
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						] = row;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						].updated_by = userInfo.EmployeeCode;
						const statusClone = [...status];
						setStatus(statusClone);
						const resUpdate = await Http.post(`/api/status/${details.id}`, {
							products:
								statusClone[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								]
						});
					}
					const resCreate = await Http.post(`/api/status/${details.id}`, {
						status,
						updated_by: userInfo.EmployeeCode,
						sectionCode: userInfo.SectionCode
					});
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
				} else {
					if (row.finished_date) {
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						] = row;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						].updated_by = userInfo.EmployeeCode;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id) +
								1
						]
							? status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
							  ].received_date
								? null
								: (status[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										) + 1
								  ].received_date = row.finished_date)
							: null;
						const statusClone = [...status];
						setStatus(statusClone);
						if (row.log) {
							const resCreate = await Http.post(`/api/status/${details.id}`, {
								status,
								updated_by: userInfo.EmployeeCode,
								sectionCode: userInfo.SectionCode,
								row
							});
							console.log(resCreate.data, 'rescreate');
							setLogs((prevState) => {
								console.log(prevState, 'prererev');
								return [
									...prevState,
									prevState.find((el) => el.id == row.id)
										? prevState.find((el) => el.id == row.id).log
											? false
											: {
													id: row.id,
													log: row.log,
													updated_at: moment().format(
														'YYYY-MM-DD, h:mm:ss a'
													)
											  }
										: {
												id: row.id,
												log: row.log,
												updated_at: moment().format('YYYY-MM-DD, h:mm:ss a')
										  }
								];
							});

							if (row.sequence > 2) {
								setStatus(
									resCreate.data.map((item, index) => {
										return {
											...item,
											status_index: index + 1,
											department:
												master.departments.length > 0
													? master.departments.find((attr) => {
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.DepartmentCode ==
																			el.department_id &&
																		el.id == affectedProds
																	);
																}
															);
															return prod
																? attr.DepartmentCode ==
																		prod.department_id
																: false;
													  })
														? master.departments.find((attr) => {
																const prod = master.products.find(
																	(el) => {
																		const affectedProds = master.affectedProducts.find(
																			(el) =>
																				el.id ==
																				item.affected_id
																		)
																			? master.affectedProducts.find(
																					(el) =>
																						el.id ==
																						item.affected_id
																			  ).product_category_id
																			: null;
																		return (
																			attr.DepartmentCode ==
																				el.department_id &&
																			el.id == affectedProds
																		);
																	}
																);
																return prod
																	? attr.DepartmentCode ==
																			prod.department_id
																	: false;
														  }).DepartmentName
														: null
													: null,
											section:
												master.sections.length > 0
													? master.sections.find((attr) => {
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.SectionCode ==
																			el.section_id &&
																		el.id == affectedProds
																	);
																}
															);
															return prod
																? attr.SectionCode ==
																		prod.section_id
																: false;
													  })
														? master.sections.find((attr) => {
																const prod = master.products.find(
																	(el) => {
																		const affectedProds = master.affectedProducts.find(
																			(el) =>
																				el.id ==
																				item.affected_id
																		)
																			? master.affectedProducts.find(
																					(el) =>
																						el.id ==
																						item.affected_id
																			  ).product_category_id
																			: null;
																		return (
																			attr.SectionCode ==
																				el.section_id &&
																			el.id == affectedProds
																		);
																	}
																);
																return prod
																	? attr.SectionCode ==
																			prod.section_id
																	: false;
														  }).SectionName
														: null
													: null,
											team:
												master.teams.length > 0
													? master.teams.find((attr) => {
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.TeamCode ==
																			el.team_id &&
																		el.id == affectedProds
																	);
																}
															);
															return prod
																? attr.TeamCode == prod.team_id
																: false;
													  })
														? master.teams.find((attr) => {
																const prod = master.products.find(
																	(el) => {
																		const affectedProds = master.affectedProducts.find(
																			(el) =>
																				el.id ==
																				item.affected_id
																		)
																			? master.affectedProducts.find(
																					(el) =>
																						el.id ==
																						item.affected_id
																			  ).product_category_id
																			: null;
																		return (
																			attr.TeamCode ==
																				el.team_id &&
																			el.id == affectedProds
																		);
																	}
																);
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
																		(el) =>
																			el.id ==
																			item.affected_id
																  ).product_category_id
																: null;
															return affectedProds
																? el.id == affectedProds
																: null;
													  })
														? master.products.find((el) => {
																const affectedProds = master.affectedProducts.find(
																	(el) =>
																		el.id == item.affected_id
																)
																	? master.affectedProducts.find(
																			(el) =>
																				el.id ==
																				item.affected_id
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

						if ([5, 23, 35, 55].indexOf(row.affected_id) == -1) {
							if (row.log && row.sequence <= 2) {
								const resUpdate = await Http.post(`/api/status/${details.id}`, [
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									],
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										) + 1
									]
								]);
							} else if (!row.log && row.sequence > 2) {
								const resUpdate = await Http.post(`/api/status/${details.id}`, [
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									],
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										) + 1
									]
								]);
							}
						} else {
							const resUpdate = await Http.post(`/api/status/${details.id}`, {
								products:
									statusClone[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									]
							});
						}
						console.log('setlolologs2');
						// const fetchConsolidatedLogs = await Http.get(`/api/statuses/${details.id}`);
						// setLogs(
						// 	fetchConsolidatedLogs.data
						// 		.map((item) => {
						// 			return { log: item.log, updated_at: item.updated_at };
						// 		})
						// 		.sort((a, b) => moment(a.updated_at).diff(b.updated_at))
						// );
					} else {
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						] = row;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						].updated_by = userInfo.EmployeeCode;
						const statusClone = [...status];
						setStatus(statusClone);
						const resUpdate = await Http.post(`/api/status/${details.id}`, {
							products:
								statusClone[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								]
						});
					}
				}
			}
		} else {
			if (key) {
				status[status.findIndex((element) => element.affected_id == row.affected_id)] = row;
				status[
					status.findIndex((element) => element.affected_id == row.affected_id)
				].updated_by = userInfo.EmployeeCode;
				const statusClone = [...status];
				setStatus(statusClone);
				if (key == 'finished_date') {
					status[
						status.findIndex((element) => element.affected_id == row.affected_id) + 1
					]
						? status[
								status.findIndex(
									(element) => element.affected_id == row.affected_id
								) + 1
						  ].received_date
							? null
							: (status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
							  ].received_date = row.finished_date)
						: null;
					const statusClone = [...status];
					setStatus(statusClone);
					if (row.log) {
						const resCreate = await Http.post(`/api/status/${details.id}`, {
							status,
							updated_by: userInfo.EmployeeCode,
							sectionCode: userInfo.SectionCode,
							row
						});
						// console.log(resCreate.data, 'rescreate');
						console.log('aaaaaaaaaaaaaaassssszzxcccc');
						setLogs((prevState) => {
							console.log(prevState, 'prererev');
							console.log(row);
							console.log(
								prevState.find((el) => el.id == row.id)
									? prevState.find((el) => el.id == row.id).log
										? false
										: {
												id: row.id,
												log: row.log,
												updated_at: moment().format('YYYY-MM-DD, h:mm:ss a')
										  }
									: {
											id: row.id,
											log: row.log,
											updated_at: moment().format('YYYY-MM-DD, h:mm:ss a')
									  }
							);
							return [
								...prevState,
								prevState.find((el) => el.id == row.id)
									? prevState.find((el) => el.id == row.id).log
										? false
										: {
												id: row.id,
												log: row.log,
												updated_at: moment().format('YYYY-MM-DD, h:mm:ss a')
										  }
									: {
											id: row.id,
											log: row.log,
											updated_at: moment().format('YYYY-MM-DD, h:mm:ss a')
									  }
							];
						});

						if (row.sequence > 2) {
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
																		(el) =>
																			el.id ==
																			item.affected_id
																  ).product_category_id
																: null;
															return (
																attr.DepartmentCode ==
																	el.department_id &&
																el.id == affectedProds
															);
														});
														return prod
															? attr.DepartmentCode ==
																	prod.department_id
															: false;
												  })
													? master.departments.find((attr) => {
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.DepartmentCode ==
																			el.department_id &&
																		el.id == affectedProds
																	);
																}
															);
															return prod
																? attr.DepartmentCode ==
																		prod.department_id
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
																		(el) =>
																			el.id ==
																			item.affected_id
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
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.SectionCode ==
																			el.section_id &&
																		el.id == affectedProds
																	);
																}
															);
															return prod
																? attr.SectionCode ==
																		prod.section_id
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
																		(el) =>
																			el.id ==
																			item.affected_id
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
												  })
													? master.teams.find((attr) => {
															const prod = master.products.find(
																(el) => {
																	const affectedProds = master.affectedProducts.find(
																		(el) =>
																			el.id ==
																			item.affected_id
																	)
																		? master.affectedProducts.find(
																				(el) =>
																					el.id ==
																					item.affected_id
																		  ).product_category_id
																		: null;
																	return (
																		attr.TeamCode ==
																			el.team_id &&
																		el.id == affectedProds
																	);
																}
															);
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
																	(el) =>
																		el.id == item.affected_id
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
																		(el) =>
																			el.id ==
																			item.affected_id
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

					if ([5, 23, 35, 55].indexOf(row.affected_id) == -1) {
						if (row.log && row.sequence <= 2) {
							const resUpdate = await Http.post(`/api/status/${details.id}`, [
								status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								],
								status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
								]
							]);
						} else if (!row.log && row.sequence > 2) {
							const resUpdate = await Http.post(`/api/status/${details.id}`, [
								status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								],
								status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
								]
							]);
						} else {
							const resUpdate = await Http.post(`/api/status/${details.id}`, {
								products:
									status[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									]
							});
						}
					} else {
						const resUpdate = await Http.post(`/api/status/${details.id}`, {
							products:
								status[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								]
						});
					}
					console.log('setlolologs3');
					// const fetchConsolidatedLogs = await Http.get(`/api/statuses/${details.id}`);
					// setLogs(
					// 	fetchConsolidatedLogs.data
					// 		.map((item) => {
					// 			return { log: item.log, updated_at: item.updated_at };
					// 		})
					// 		.sort((a, b) => moment(a.updated_at).diff(b.updated_at))
					// );
				} else {
					if (key !== 'log') {
						// setLogs((prevState) => [
						// 	...prevState,
						// 	{ log: row.log, updated_at: moment().format('YYYY-MM-DD, h:mm:ss a') }
						// ]);
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						] = row;
						status[
							status.findIndex((element) => element.affected_id == row.affected_id)
						].updated_by = userInfo.EmployeeCode;

						if (
							status[
								status.findIndex(
									(element) => element.affected_id == row.affected_id
								)
							].assessment_id !== 1
						) {
							// status[
							// 	status.findIndex(
							// 		(element) => element.affected_id == row.affected_id
							// 	) + 1
							// ]
							// 	?
							status[
								status.findIndex(
									(element) => element.affected_id == row.affected_id
								) + 1
							].received_date =
								// ? null
								// : (status[
								// 		status.findIndex(
								// 			(element) => element.affected_id == row.affected_id
								// 		) + 1
								//   ].received_date =
								//   row.finished_date
								// 		? row.finished_date
								// 		:
								moment().format('YYYY-MM-DD HH:mm:ss');
							// : null;
							const products = [...status];
							setStatus(products);
							console.log('setStatus8');
							const resUpdate = await Http.post(`/api/status/${details.id}`, [
								products[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									)
								],
								products[
									status.findIndex(
										(element) => element.affected_id == row.affected_id
									) + 1
								]
							]);
						} else {
							const products = [...status];
							setStatus(products);
							console.log('setStatus9');
							const resUpdate = await Http.post(`/api/status/${details.id}`, {
								products:
									products[
										status.findIndex(
											(element) => element.affected_id == row.affected_id
										)
									]
							});
						}
						console.log('setlolologs4');
						// const fetchConsolidatedLogs = await Http.get(`/api/statuses/${details.id}`);

						// setLogs(
						// 	fetchConsolidatedLogs.data
						// 		.map((item) => {
						// 			return { log: item.log, updated_at: item.updated_at };
						// 		})
						// 		.sort((a, b) => moment(a.updated_at).diff(b.updated_at))
						// );
					}
				}
			}
		}

		// } else {

		// }

		// let updateStatus;
		// if (key == 'finished_date') {
		// } else {
		// 	updateStatus = await Http.post(`/api/status/${details.id}`, {
		// 		products:
		// 			products[status.findIndex((element) => element.affected_id == row.affected_id)]
		// 	});
		// }
		// setProduct(products);
		setDetail(details);
		// setState({ details: state.details, products: state.products });
	};
	return (
		<HenkouContainer
			handleEvent={handleEvent}
			handleUpdate={handleUpdate}
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
