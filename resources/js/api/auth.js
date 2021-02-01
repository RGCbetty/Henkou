import Http from '../Http';
import * as action from '../redux/actions/auth';

export const login = credentials => {
    return async dispatch => {
        try {
            const result = await Http.post('/api/login', credentials);
            if (result.data.status_code == 500) throw result;
            return dispatch(action.authLogin(result.data));
        } catch (error) {
            console.error(error);
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
