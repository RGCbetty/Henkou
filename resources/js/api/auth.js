import Axios from 'axios';
import Http from '../Http';
import * as action from '../redux/actions/auth';

export const login = (credentials) => {
	return async (dispatch) => {
		try {
			const result = await Http.post('/api/login', credentials);
			if (result.data.status_code == 500) throw result;
			const departments = await Http.get('/api/master/departments');
			const sections = await Http.get('/api/master/sections');
			const teams = await Http.get('/api/master/teams');
			const products = await Http.get(`/api/master/products`);
			const planstatus = await Http.get('/api/master/planstatuses');
			const affectedProducts = await Http.get('/api/master/products/planstatus');
			const thAssessments = await Http.get('/api/master/THassessments');
			const types = await Http.get(`/api/master/types`);
			const thActions = await Http.get('/api/master/actions');
			const reasons = await Http.get(`/api/master/reasons`);

			// console.log(result);
			// const instance = Http.create({
			// 	baseURL: 'http://adminsql1/api/',
			// 	withCredentials: false,
			// 	headers: {
			// 		'master-api': 'db588403f0a1d3b897442a28724166b4'
			// 	}
			// });
			// const response = await instance.get(`basicinfo/${credentials.employee_no}`);

			return dispatch(
				action.authLogin({
					token: result.data,
					userInfo: result.data.user,
					departments: departments.data,
					sections: sections.data,
					teams: teams.data,
					planstatus: planstatus.data,
					products: products.data,
					affectedProducts: affectedProducts.data,
					thAssessments: thAssessments.data,
					types: types.data,
					thActions: thActions.data,
					reasons: reasons.data
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

// export const checkAuth = state => {
//     return async dispatch => {
//         try {
//             console.log(state);
//             const response = await Http.get(`/api/auth`);
//             console.log(response);
//         } catch (e) {
//             console.error(e);
//             // const { status_code, message } = e.data;
//             // const data = {
//             //     status_code,
//             //     message
//             // };
//             return e;
//         }
//     };
// };
