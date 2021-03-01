import Axios from 'axios';
import Http from '../Http';
import * as action from '../redux/actions/auth';

export const login = (credentials) => {
	return async (dispatch) => {
		try {
			const result = await Http.post('/api/login', credentials);
			const instance = Http.create({
				baseURL: 'http://adminsql1/api/',
				withCredentials: false,
				headers: {
					'master-api': 'db588403f0a1d3b897442a28724166b4'
				}
			});
			const response = await instance.get(`basicinfo/${credentials.employee_no}`);
			if (result.data.status_code == 500) throw result;

			return dispatch(action.authLogin({ token: result.data, userInfo: response.data[0] }));
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
