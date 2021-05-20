import Http from '../Http';
import moment from 'moment';
export default class Logs {
	constructor() {}
	async fetchLogs(customerCode, revIndex) {
		const { data: logs, status } = await Http.get(
			`api/henkou/plans/${customerCode}/revision/${revIndex}`
		);
		if (status == 200) {
			return this.mergeLogs(logs);
		}
	}
	mergeLogs(logs) {
		const productLogs = logs.map((item) => {
			return {
				...item,
				logs: item.log,
				rev_no: item?.details?.rev_no
			};
		});
		const detailsLogs = logs
			.filter(
				(val, id, arr) =>
					arr.findIndex(
						(item) =>
							item.plan.logs === val.plan.logs && item.plan.rev_no === val.plan.rev_no
					) === id
			)
			.map((val) => val.plan);

		const pendingLogs = productLogs
			.map((item) => {
				return item?.pendings;
			})
			.flat(1);
		const henkouLogs = [...detailsLogs, ...productLogs];
		const mergeLogs = [...henkouLogs, ...pendingLogs];
		return mergeLogs
			.map((item) => {
				return {
					...item,
					id: item.id,
					borrow_details: item.borrow_details,
					rev_no: item?.rev_no ? item.rev_no : item?.details?.rev_no,
					product_name: item?.affected_product?.product_category?.product_name,
					updated_by: item.updated_by,
					log: item.logs,
					created_at: item.created_at
				};
			})
			.sort((a, b) => moment(a.created_at).diff(b.created_at));
	}
}
