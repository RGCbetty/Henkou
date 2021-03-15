import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useThPlansRetriever = (user, planStatus) => {
	const [tableState, setTable] = useState({
		plans: [],
		pagination: {
			current: 1,
			pageSize: 5
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

					const { henkouPlans, pagination, total } = response;
					async function findAsync(arr, id) {
						const promises = arr.map(async (item) => {
							return item.id == id ? item : null;
						});
						const results = await Promise.all(promises);

						const index = results.findIndex((result) => result);
						console.log(index);

						return arr[index] ? arr[index] : null;
					}
					console.log(henkouPlans);
					const THplans = await Promise.all(
						henkouPlans.map(async (item, index) => {
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
								plan_status: await findAsync(
									planstatus.data,
									await planStatus(item)
								)
							};
						})
					);
					if (mounted) {
						setTable({
							loading: false,
							plans: THplans,
							pagination: {
								...pagination,
								total: total
								// showTotal: (total) => `Total ${total} items`
								// 200 is mock data, you should read it from server
								// total: data.totalCount,
							}
						});
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
