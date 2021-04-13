import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';
const durationAsString = (start, end) => {
	const duration = moment.duration(moment(end).diff(moment(start)));

	//Get Days
	const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
	const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all

	//Get Hours
	const hours = duration.hours();
	const hoursFormatted = hours ? `${hours}h ` : '';

	//Get Minutes
	const minutes = duration.minutes();
	const minutesFormatted = minutes ? `${minutes}m ` : '';

	const seconds = duration.seconds();
	const secondsFormatted = `${seconds}s`;

	return [daysFormatted, hoursFormatted, minutesFormatted, secondsFormatted].join('');
};
export const completeDetailsStatus = async (record, affectedProducts, product, master, details) => {
	const statuses = await Http.get(`/api/statuses/${record.detail_id}`);
	const filterByAffectedID = statuses.data.filter(
		(item) => item.affected_id == record.affected_id
	);
	console.log(filterByAffectedID);

	const statusWithProductKey = filterByAffectedID.map((item, index) => {
		if (filterByAffectedID.length == index + 1) {
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
