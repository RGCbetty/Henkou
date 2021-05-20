import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import Http from '../Http';
import durationAsString from '../utils/diffDate';

export const fetchRegistrationData = async () => {
	const { data, status } = await Http.get('api/henkou/registration');
	if (status == 200) {
		const { THtemp, THshiyousho, PlanStatus, HenkouReason, THAction, THAssessment } = data;
		const instance = Http.create({
			baseURL: 'http://hrdapps68:8070/api',
			withCredentials: false
		});
		const { data: TH } = await instance.post('/pcms/planstatus', {
			plans: THshiyousho
		});
		const THplans = TH.map((item, key) => {
			return {
				...item,
				key,
				remarks: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.remarks,
				th_assessment_id: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.th_assessment_id,
				reason_id: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.reason_id,
				th_action_id: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.th_action_id,
				start_date: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.start_date,
				finished_date: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.finished_date,
				pending_start_date: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.pending_start_date,
				pending_resume_date: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.pending_resume_date,
				remarks: THtemp.find(
					(el) =>
						el.customer_code == item.ConstructionCode &&
						el.plan_no == item.PlanNo &&
						el.th_no == item.RequestNo
				)?.remarks,
				plan_status: PlanStatus.find((el) => el.id == item.plan_status)
			};
		}).filter((item) => !item.finished_date);

		return {
			THplans,
			PlanStatus,
			HenkouReason,
			THAction,
			THAssessment
		};
	}
};
export const useRegistrationState = (user) => {
	const planDetails = {
		customer_code: '',
		house_code: '',
		house_type: '',
		method: '',
		plan_no: '',
		floors: '',
		plan_specification: '',
		joutou_date: '',
		days_before_joutou: '',
		kiso_start: '',
		before_kiso_start: '',
		dodai_invoice: '',
		['1F_panel_invoice']: '',
		['1F_hari_invoice']: '',
		['1F_iq_invoice']: '',
		rev_no: '',
		type_id: '',
		reason_id: '',
		logs: '',
		department_id: '',
		section_id: '',
		team_id: '',
		updated_by: ''
	};
	const [state, setState] = useState({
		// TH
		plans: [],
		filterplans: [],
		pagination: {
			current: 1,
			pageSize: 10,
			showTotal: ''
		},
		loading: true,

		/* MODAL */
		thModalVisibility: false,
		thSelectedPlan: [],
		/* MODAL */
		// TH
		planDetails,
		// MASTER
		reason: [],
		THAction: [],
		THAssessment: [],
		PlanStatus: [],
		types: [],
		departments: [],
		// MASTER
		products: []
	});
	const { pagination } = state;

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				if (user.SectionCode == '00465' && user.TeamCode == '00133') {
					const {
						THplans,
						PlanStatus,
						HenkouReason,
						THAction,
						THAssessment
					} = await fetchRegistrationData();
					if (mounted) {
						setState((prevState) => {
							return {
								...prevState,
								loading: false,
								plans: THplans.length > 0 ? THplans : [],
								pagination: {
									...pagination,
									total: THplans.length,
									showTotal: (total) => `Total ${total} items`
									// 200 is mock data, you should read it from server
									// total: data.totalCount,
								},
								filterplans: [],
								reason: HenkouReason,
								THAction,
								THAssessment,
								PlanStatus
							};
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
	return [state, setState];
};
