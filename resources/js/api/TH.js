import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useThPlansRetriever = (user) => {
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
				if (user.SectionCode == '465' && user.TeamCode == '0133') {
					const response = await fetchThPlans(setTable, tableState.pagination);
					const tempTHplans = await fetchThTemp();
					const { henkouPlans, pagination, total } = response;

					const THplans = henkouPlans.map((item, index) => {
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
								: null
						};
					});
					if (mounted) {
						setTable({
							loading: false,
							plans: THplans,
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
