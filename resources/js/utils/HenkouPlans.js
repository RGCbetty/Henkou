import moment from 'moment';
import durationAsString from '../utils/diffDate';
import Http from '../Http';
export class Plans {
	static async get(url, params, master) {
		const response = await Http.get(url, { params: params });
		const { data } = response;
		return this.mapAPI(data, master);
	}
	static mapAPI(response, master) {
		return response
			.map(({ type, reason, ...plan }) => {
				return plan.statuses.map((stat) => {
					return {
						...stat,
						department: master.departments.find(
							(el) => el.DepartmentCode == stat.affected_product.product.department_id
						).DepartmentName,
						section: master.sections.find(
							(el) => el.SectionCode == stat.affected_product.product.section_id
						).SectionName,

						team: master.teams.find(
							(el) => el.TeamCode == stat.affected_product.product.team_id
						).TeamName,
						product_name: stat.affected_product.product.product_name,
						plan_status: plan.plan_status.plan_status_name,
						house_code: plan.house_code,
						house_type: plan.house_type,
						henkou_type: type ? type.type_name : null,
						henkou_reason: reason ? reason.reason_name : null,
						construction_schedule: plan.construction_schedule,
						days_in_process: isNaN(moment(stat.start_date).diff(stat.finished_date))
							? ''
							: durationAsString(stat.start_date, stat.finished_date),
						pending_reason:
							stat.pending.length !== 0
								? stat.pending[stat.pending.length - 1].reason
								: '-',
						invoice: plan.invoice,
						th_no: plan.th_no,
						plan_no: plan.plan_no,
						rev_no: plan.rev_no,
						method: plan.method,
						created_at: moment.utc(plan.created_at).format('YYYY-MM-DD hh:mm:ss'),
						customer_code: plan.customer_code
					};
				});
			})
			.reduce((acc, val) => {
				return acc.concat(val);
			}, []);
	}
}
