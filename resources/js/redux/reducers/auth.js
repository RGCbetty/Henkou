import { AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT } from '../types';
import CryptoJS from 'crypto-js';
import Http from '../../Http';

const defaultUser = {
	EmployeeCode: null,
	EmployeeName: null,
	DepartmentCode: null,
	DepartmentName: null,
	SectionCode: null,
	SectionName: null,
	TeamCode: null,
	TeamName: null,
	DepartmentCode: null
};

const initialState = {
	isAuthenticated: false,
	user: defaultUser
};

const authLogin = (state, payload) => {
	console.log(payload);
	const { access_token } = payload.token;
	const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload.user), access_token).toString();
	localStorage.setItem('access_token', access_token);
	localStorage.setItem('user', ciphertext);
	Http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	const stateObj = {
		...state,
		isAuthenticated: true,
		user: payload.user
	};
	return stateObj;
};

const checkAuth = (state) => {
	let decryptedUserInfo = '';
	if (localStorage.getItem('access_token')) {
		const userInfoBytes = CryptoJS.AES.decrypt(
			localStorage.getItem('user'),
			localStorage.getItem('access_token')
		).toString(CryptoJS.enc.Utf8);
		decryptedUserInfo = JSON.parse(userInfoBytes);
	}
	const stateObj = {
		...state,
		isAuthenticated: !!localStorage.getItem('access_token'),
		user: decryptedUserInfo
	};
	if (state.isAuthenticated) {
		Http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
			'access_token'
		)}`;
	}
	return stateObj;
};

const logout = (state) => {
	// localStorage.removeItem('access_token');
	// localStorage.removeItem('user');
	// const stateObj = {
	//     ...state,
	//     isAuthenticated: false,
	//     user: defaultUser
	// };
	localStorage.removeItem('access_token');
	localStorage.removeItem('user');
	const stateObj = {
		...state,
		isAuthenticated: false,
		user: defaultUser
	};
	return stateObj;
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case AUTH_LOGIN:
			return authLogin(state, payload);
		case AUTH_CHECK:
			return checkAuth(state);
		case AUTH_LOGOUT:
			return logout(state);
		default:
			return state;
	}
};
