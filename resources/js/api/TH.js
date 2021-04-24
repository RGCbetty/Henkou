import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import Http from '../Http';
import durationAsString from '../utils/diffDate';

export const THplansWithPlanStatus = async (user) => {
	if (user.SectionCode == '00465' && user.TeamCode == '00133') {
		const response = await fetchThPlans();
		const tempTHplans = await fetchThTemp();
		const planstatus = await Http.get('/api/planstatuses');
		const instance = Http.create({
			baseURL: 'http://hrdapps68:8070/api',
			withCredentials: false
		});
		const { THplans } = response;
		const THplansWithPlanStatus = await instance.post('/pcms/planstatus', {
			plans: THplans
		});
		if (THplansWithPlanStatus.data.length > 0) {
			const data = THplansWithPlanStatus.data
				.map((item) => {
					return {
						...item,
						remarks: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).remarks
							: null,
						th_assessment_id: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_assessment_id
							: null,
						reason_id: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).reason_id
							: null,
						th_action_id: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).th_action_id
							: null,
						start_date: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).start_date
							: null,
						finished_date: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).finished_date
							: null,
						pending_start_date: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_start_date
							: null,
						pending_resume_date: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).pending_resume_date
							: null,
						daysinprocess: isNaN(
							moment(
								tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
								)
									? tempTHplans.find(
											(el) =>
												el.customer_code == item.ConstructionCode &&
												el.plan_no == item.PlanNo &&
												el.th_no == item.RequestNo
									  ).start_date
									: null
							).diff(
								tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
								)
									? tempTHplans.find(
											(el) =>
												el.customer_code == item.ConstructionCode &&
												el.plan_no == item.PlanNo &&
												el.th_no == item.RequestNo
									  ).finished_date
									: null
							)
						)
							? ''
							: durationAsString(
									tempTHplans.find(
										(el) =>
											el.customer_code == item.ConstructionCode &&
											el.plan_no == item.PlanNo &&
											el.th_no == item.RequestNo
									)
										? tempTHplans.find(
												(el) =>
													el.customer_code == item.ConstructionCode &&
													el.plan_no == item.PlanNo &&
													el.th_no == item.RequestNo
										  ).start_date
										: null,
									tempTHplans.find(
										(el) =>
											el.customer_code == item.ConstructionCode &&
											el.plan_no == item.PlanNo &&
											el.th_no == item.RequestNo
									)
										? tempTHplans.find(
												(el) =>
													el.customer_code == item.ConstructionCode &&
													el.plan_no == item.PlanNo &&
													el.th_no == item.RequestNo
										  ).finished_date
										: null
							  ),
						remarks: tempTHplans.find(
							(el) =>
								el.customer_code == item.ConstructionCode &&
								el.plan_no == item.PlanNo &&
								el.th_no == item.RequestNo
						)
							? tempTHplans.find(
									(el) =>
										el.customer_code == item.ConstructionCode &&
										el.plan_no == item.PlanNo &&
										el.th_no == item.RequestNo
							  ).remarks
							: null,
						plan_status: planstatus.data.find((el) => el.id == item.plan_status)
					};
				})
				.filter((item) => !item.finished_date);
			// if (mounted) {
			return { data };
			// setTable({
			// 	loading: false,
			// 	plans: THplans.length > 0 ? THplans : [],
			// 	pagination: {
			// 		...pagination,
			// 		total: total,
			// 		showTotal: (total) => `Total ${total} items`
			// 		// 200 is mock data, you should read it from server
			// 		// total: data.totalCount,
			// 	}
			// });
			// }
		}
	}
};
export const useThPlansRetriever = (user) => {
	const [tableState, setTable] = useState({
		plans: [],
		pagination: {
			current: 1,
			pageSize: 10,
			showTotal: ''
		},
		loading: true
	});
	const { plans, pagination, loading } = tableState;

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const THplans = await THplansWithPlanStatus(user);
				const { data } = THplans;
				console.log(data.length);
				if (mounted) {
					setTable({
						loading: false,
						plans: data.length > 0 ? data : [],
						pagination: {
							...pagination,
							total: data.length,
							showTotal: (total) => `Total ${total} items`
							// 200 is mock data, you should read it from server
							// total: data.totalCount,
						}
					});
				}
			} catch (error) {
				if (Http.isCancel(error)) {
					console.error(error);
				} else {
					throw error;
				}
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [tableState, setTable];
};

export const fetchThPlans = async () => {
	const response = await Http.get(`/api/plans`);
	const { data } = response;
	let THplans = data.map((item, index) => {
		return {
			key: index,
			thview: 'view PDF',
			...item,
			th_assessment_id: '',
			start: 'Start Date',
			th_action_id: '',
			reason_id: '',
			remarks: ''
		};
	});
	return { THplans };
};

export const useTempThRetriever = () => {
	const [tempTh, setTempTh] = useState([]);
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const thPlans = await fetchThTemp();
				if (mounted) {
					setTempTh(thPlans);
				}
			} catch (error) {
				if (Http.isCancel(error)) {
					console.error(error);
				} else {
					throw error;
				}
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [tempTh, setTempTh];
};

export const fetchThTemp = async () => {
	const response = await Http.get(`/api/th/plans`);
	return response.data;
};
