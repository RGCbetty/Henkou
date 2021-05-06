import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';
import durationAsString from '../utils/diffDate';
export const completeDetailsStatus = async (record, affectedProducts, product, master, details) => {
	const [firstDigit, secondDigit] = details ? details.rev_no.split('-') : '';
	// const [firstIndex] = details.rev_no.split('-');
	const statuses = await Http.get(
		// `/api/henkou/plans/${details.customer_code}/products/${record.affected_id}/logs`
		`api/henkou/plans/${details.customer_code}/revision/${firstDigit}/product/${record.affected_id}`
		// `/api/henkou/plans/${details.customer_code}/product/id/${record.affected_id}`
		// `/api/henkou/plans/${details.customer_code}/products/${details.id}`
	);
	console.log(statuses);
	// const filterByAffectedID = statuses.data.filter(
	// 	(item) => item.affected_id == record.affected_id
	// );

	const statusWithProductKey = statuses.data.map((item, index) => {
		if (statuses.data.length == index + 1) {
			return {
				disableHistory: false,
				status_index: index + 1,
				...item,
				logs: item.log ? item.log : item.logs,
				days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
					? ''
					: durationAsString(item.start_date, item.finished_date),
				product_key: affectedProducts.find((el) => el.id == item.affected_id)
					? product
						? product.find(
								(el) =>
									el.id ==
									affectedProducts.find((el) => el.id == item.affected_id)
										.product_category_id
						  ).product_key
						: null
					: null,
				department:
					master.departments.length > 0
						? master.departments.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return (
										attr.DepartmentCode == el.department_id &&
										el.id == affectedProds
									);
								});
								return prod ? attr.DepartmentCode == prod.department_id : false;
						  })
							? master.departments.find((attr) => {
									const prod = product.find((el) => {
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
							  }).DepartmentName
							: null
						: null,
				section:
					master.sections.length > 0
						? master.sections.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return (
										attr.SectionCode == el.section_id && el.id == affectedProds
									);
								});
								return prod ? attr.SectionCode == prod.section_id : false;
						  })
							? master.sections.find((attr) => {
									const prod = product.find((el) => {
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
					master.teams.length > 0
						? master.teams.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return attr.TeamCode == el.team_id && el.id == affectedProds;
								});
								return prod ? attr.TeamCode == prod.team_id : false;
						  })
							? master.teams.find((attr) => {
									const prod = product.find((el) => {
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
							  }).TeamName
							: null
						: null,
				sequence:
					details.method == '2'
						? affectedProducts.find((el) => el.id == item.affected_id)
							? affectedProducts.find((el) => el.id == item.affected_id).sequence_no
							: null
						: affectedProducts.find((el) => el.id == item.affected_id)
						? affectedProducts.find((el) => el.id == item.affected_id).sequence_no
						: null,

				product_name:
					product.length > 0
						? product.find((el) => {
								const affectedProds = affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? affectedProducts.find((el) => el.id == item.affected_id)
											.product_category_id
									: null;
								return affectedProds ? el.id == affectedProds : null;
						  })
							? product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return affectedProds ? el.id == affectedProds : null;
							  }).product_name
							: null
						: null
			};
		} else {
			return {
				status_index: index + 1,
				disableHistory: true,
				...item,
				logs: item.log ? item.log : item.logs,
				days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
					? ''
					: durationAsString(item.start_date, item.finished_date),
				product_key: affectedProducts.find((el) => el.id == item.affected_id)
					? product
						? product.find(
								(el) =>
									el.id ==
									affectedProducts.find((el) => el.id == item.affected_id)
										.product_category_id
						  ).product_key
						: null
					: null,
				department:
					master.departments.length > 0
						? master.departments.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return (
										attr.DepartmentCode == el.department_id &&
										el.id == affectedProds
									);
								});
								return prod ? attr.DepartmentCode == prod.department_id : false;
						  })
							? master.departments.find((attr) => {
									const prod = product.find((el) => {
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
							  }).DepartmentName
							: null
						: null,
				section:
					master.sections.length > 0
						? master.sections.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return (
										attr.SectionCode == el.section_id && el.id == affectedProds
									);
								});
								return prod ? attr.SectionCode == prod.section_id : false;
						  })
							? master.sections.find((attr) => {
									const prod = product.find((el) => {
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
					master.teams.length > 0
						? master.teams.find((attr) => {
								const prod = product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return attr.TeamCode == el.team_id && el.id == affectedProds;
								});
								return prod ? attr.TeamCode == prod.team_id : false;
						  })
							? master.teams.find((attr) => {
									const prod = product.find((el) => {
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
							  }).TeamName
							: null
						: null,
				sequence:
					details.method == '2'
						? affectedProducts.find((el) => el.id == item.affected_id)
							? affectedProducts.find((el) => el.id == item.affected_id).sequence_no
							: null
						: affectedProducts.find((el) => el.id == item.affected_id)
						? affectedProducts.find((el) => el.id == item.affected_id).sequence_no
						: null,

				product_name:
					product.length > 0
						? product.find((el) => {
								const affectedProds = affectedProducts.find(
									(el) => el.id == item.affected_id
								)
									? affectedProducts.find((el) => el.id == item.affected_id)
											.product_category_id
									: null;
								return affectedProds ? el.id == affectedProds : null;
						  })
							? product.find((el) => {
									const affectedProds = affectedProducts.find(
										(el) => el.id == item.affected_id
									)
										? affectedProducts.find((el) => el.id == item.affected_id)
												.product_category_id
										: null;
									return affectedProds ? el.id == affectedProds : null;
							  }).product_name
							: null
						: null
			};
		}
	});
	return statusWithProductKey;
};
