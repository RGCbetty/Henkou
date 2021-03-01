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
	userInfo: defaultUser
};

const authLogin = (state, payload) => {
	const { access_token } = payload.token;
	console.log(payload.userInfo);
	const ciphertext = CryptoJS.AES.encrypt(
		JSON.stringify(payload.userInfo),
		access_token
	).toString();

	// const { access_token } = payload;
	localStorage.setItem('access_token', access_token);

	localStorage.setItem('userInfo', ciphertext);
	Http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	const stateObj = {
		...state,
		isAuthenticated: true,
		userInfo: payload.userInfo
	};
	// const stateObj = {
	//     ...state,
	//     isAuthenticated: true,
	//     user
	// };
	return stateObj;
};

const checkAuth = (state) => {
	let decryptedData = '';
	if (localStorage.getItem('access_token')) {
		const bytes = CryptoJS.AES.decrypt(
			localStorage.getItem('userInfo'),
			localStorage.getItem('access_token')
		).toString(CryptoJS.enc.Utf8);
		decryptedData = JSON.parse(bytes);
	}
	const stateObj = {
		...state,
		isAuthenticated: !!localStorage.getItem('access_token'),
		userInfo: decryptedData
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
		userInfo: defaultUser
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
