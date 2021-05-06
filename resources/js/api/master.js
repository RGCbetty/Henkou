import React, { useState, useEffect, useLayoutEffect } from 'react';
import Http from '../Http';
import * as action from '../redux/actions/master';
export const useMasterPlanStatuses = () => {
	const [planStatuses, setPlanStatuses] = useState([]);
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const planstatus = await Http.get('/api/master/planstatuses');
				if (mounted) {
					setPlanStatuses(planstatus.data);
				}
			} catch (e) {
				console.error(e);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [planStatuses, setPlanStatuses];
};

export const useMasterDetails = () => {
	const [info, setInfo] = useState({
		types: [],
		reasons: [],
		products: [],
		thAssessments: [],
		thActions: [],
		tempTH: [],
		affectedProducts: [],
		fetching: true
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const thAssessments = await Http.get('/api/THassessments');
				const types = await Http.get(`/api/types`);
				const products = await Http.get('/api/products');
				const thActions = await Http.get('/api/actions');
				const reasons = await Http.get(`/api/reasons`);
				const affectedProducts = await Http.get('/api/products/planstatus');
				const tempTH = await Http.get(`/api/th/plans`);
				if (mounted) {
					setInfo({
						thAssessments: thAssessments.data,
						types: types.data,
						reasons: reasons.data,
						thActions: thActions.data,
						affectedProducts: affectedProducts.data,
						tempTH: tempTH.data,
						products: products.data,
						fetching: false
					});
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [info, setInfo];
};

export const useMasterSuppliers = () => {
	const [allSupplier, setAllSupplier] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const allSupplier = await Http.get('/api/suppliers');
				if (mounted) {
					setAllSupplier(allSupplier.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [allSupplier, setAllSupplier];
};
export const useMasterDepartment = () => {
	const [departments, setDepartments] = useState([]);

	useLayoutEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const departments = await Http.get('api/departments');
				// const instance = Http.create({
				// 	baseURL: 'http://adminsql1/api',
				// 	withCredentials: false,
				// 	headers: {
				// 		'master-api': 'db588403f0a1d3b897442a28724166b4'
				// 	}
				// });
				// const department = await instance.get('/company/department/hrd');
				if (mounted) {
					setDepartments(departments.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [departments, setDepartments];
};
export const useMasterSection = () => {
	const [sections, setSections] = useState([]);

	useLayoutEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const sections = await Http.get('api/sections');
				// const instance = Http.create({
				// 	baseURL: 'http://adminsql1/api',
				// 	withCredentials: false,
				// 	headers: {
				// 		'master-api': 'db588403f0a1d3b897442a28724166b4'
				// 	}
				// });
				// const department = await instance.get('/company/department/hrd');
				if (mounted) {
					setSections(sections.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [sections, setSections];
};
export const useMasterTeam = () => {
	const [teams, setTeams] = useState([]);

	useLayoutEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const teams = await Http.get('api/teams');
				if (mounted) {
					setTeams(teams.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [teams, setTeams];
};
export const useMasterSectionByDepartment = (department_id) => {
	const [sections, setSections] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const sections = await Http.get('api/sections', {
					params: { department_id }
				});
				// const instance = Http.create({
				// 	baseURL: 'http://adminsql1/api',
				// 	withCredentials: false,
				// 	headers: {
				// 		'master-api': 'db588403f0a1d3b897442a28724166b4'
				// 	}
				// });
				// const department = await instance.get('/company/department/hrd');
				if (mounted) {
					setSections(sections.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [sections, setSections];
};
export const useMasterTeamByDepartmentAndSection = (department_id, section_id) => {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const teams = await Http.get('api/teams', {
					params: { department_id, section_id }
				});
				// const instance = Http.create({
				// 	baseURL: 'http://adminsql1/api',
				// 	withCredentials: false,
				// 	headers: {
				// 		'master-api': 'db588403f0a1d3b897442a28724166b4'
				// 	}
				// });
				// const department = await instance.get('/company/department/hrd');
				if (mounted) {
					setTeams(teams.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [teams, setTeams];
};
export const useMasterCompany = () => {
	const [company, setCompany] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const instance = Http.create({
					baseURL: 'http://adminsql1/api',
					withCredentials: false,
					headers: {
						'master-api': 'db588403f0a1d3b897442a28724166b4'
					}
				});
				const company = await instance.get('/company/department/section/team/hrd');
				if (mounted) {
					setCompany(company.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [company, setCompany];
};
export const setMaster = () => {
	return async (dispatch) => {
		try {
			const departments = await Http.get('api/departments');
			const sections = await Http.get('api/sections');
			const teams = await Http.get('api/teams');
			// const instance = Http.create({
			// 	baseURL: 'http://hrdapps71:4900/',

			// 	// baseURL: 'http://10.168.64.223:4900/',
			// 	withCredentials: false
			// 	// headers: {
			// 	// 	'master-api': 'db588403f0a1d3b897442a28724166b4'
			// 	// }
			// });

			// const response = await instance.get('get/getProductListActive?from=plugins');
			// if (response.data.status_code == 500) throw result;

			return dispatch(
				action.setMaster({
					departments: departments.data,
					sections: sections.data,
					teams: teams.data
				})
			);
		} catch (error) {
			const { status_code, message } = error.data;
			const data = {
				status_code,
				message
			};
			return data;
		}
	};
};
