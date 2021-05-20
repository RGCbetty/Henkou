import Axios from 'axios';
import Http from '../Http';
import * as action from '../redux/actions/auth';

export const login = (credentials) => {
	return async (dispatch) => {
		try {
			const { data, status } = await Http.post('/api/login', credentials);
			if (data.status_code == 200 && status == 200) {
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
						token: data,
						user: data.user
					})
				);
			}
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
