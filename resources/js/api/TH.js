import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import Http from '../Http';
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
export const THplansWithPlanStatus = () => {};
export const useThPlansRetriever = (user, planStatus) => {
	const [tableState, setTable] = useState({
		plans: [],
		pagination: {
			current: 1,
			pageSize: 10
		},
		loading: false
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				if (user.SectionCode == '00465' && user.TeamCode == '00133') {
					const response = await fetchThPlans(setTable, tableState.pagination);
					const tempTHplans = await fetchThTemp();
					const planstatus = await Http.get('/api/planstatuses');
					const instance = Http.create({
						baseURL: 'http://hrdapps68:8070/api',
						withCredentials: false
					});
					const { henkouPlans, pagination, total } = response;
					const THplansWithPlanStatus = await instance.post('/pcms/planstatus', {
						plans: henkouPlans
					});
					if (THplansWithPlanStatus.data.length > 0) {
						const THplans = THplansWithPlanStatus.data.map((item) => {
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
															el.customer_code ==
																item.ConstructionCode &&
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
															el.customer_code ==
																item.ConstructionCode &&
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
						});
						if (mounted) {
							setTable({
								loading: false,
								plans: THplans.length > 0 ? THplans : [],
								pagination: {
									...pagination,
									total: total,
									showTotal: (total) => `Total ${total} items`
									// 200 is mock data, you should read it from server
									// total: data.totalCount,
								}
							});
						}
					} else {
						if (mounted) {
							setTable({
								loading: false,
								plans: [],
								pagination: {
									...pagination,
									total: total,
									showTotal: (total) => `Total ${total} items`
									// 200 is mock data, you should read it from server
									// total: data.totalCount,
								}
							});
						}
					}
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

export const fetchThPlans = async (setTable, pagination) => {
	setTable({ loading: true });
	const response = await Http.get(`/api/plans`, {
		params: pagination
	});

	const { data, total } = response.data;
	let henkouPlans = data.map((item, index) => {
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

	return { henkouPlans, pagination, total };
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
