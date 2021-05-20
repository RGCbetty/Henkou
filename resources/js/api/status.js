import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';
import durationAsString from '../utils/diffDate';
export const completeDetailsStatus = async (record, details) => {
	const [firstDigit, secondDigit] = details?.rev_no.split('-');
	// const [firstIndex] = details.rev_no.split('-');
	const { data: products, status } = await Http.get(
		// `/api/henkou/plans/${details.customer_code}/products/${record.affected_id}/logs`
		`api/henkou/plans/${details.customer_code}/revision/${firstDigit}/product/${record.affected_id}`
		// `/api/henkou/plans/${details.customer_code}/product/id/${record.affected_id}`
		// `/api/henkou/plans/${details.customer_code}/products/${details.id}`
	);
	// const filterByAffectedID = statuses.data.filter(
	// 	(item) => item.affected_id == record.affected_id
	// );
	if (status == 200) {
		const statusWithProductKey = products.map(
			(
				// { affected_product, ...item }
				item,
				index
			) => {
				// console.log(affected_product);
				// console.log(affected_product, item);
				// const { product, sequence_no } = affected_product;
				// const { department, section, team, product_name } = product;
				return {
					disableHistory: products.length == index + 1 ? false : true,
					status_index: index + 1,
					...item,
					// logs: item.log ? item.log : item.logs,
					days_in_process: isNaN(moment(item.start_date).diff(item.finished_date))
						? ''
						: durationAsString(item.start_date, item.finished_date)
					// product_key: affectedProducts.find((el) => el.id == item.affected_id)
					// 	? product
					// 		? product.find(
					// 				(el) =>
					// 					el.id ==
					// 					affectedProducts.find((el) => el.id == item.affected_id)
					// 						.product_category_id
					// 		  ).product_key
					// 		: null
					// 	: null,
					// department: department.DepartmentName,
					// section: section.SectionName,
					// team: team.TeamName,
					// sequence: sequence_no,
					// product_name: product_name
				};
			}
		);
		return statusWithProductKey;
	}
};
