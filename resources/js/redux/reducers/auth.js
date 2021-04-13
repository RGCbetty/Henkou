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
	userInfo: defaultUser,
	master: []
};

const authLogin = (state, payload) => {
	const { access_token } = payload.token;
	const master = {
		departments: payload.departments,
		sections: payload.sections,
		teams: payload.teams,
		planstatus: payload.planstatus,
		products: payload.products,
		affectedProducts: payload.affectedProducts,
		thAssessments: payload.thAssessments,
		types: payload.types,
		thActions: payload.thActions,
		reasons: payload.reasons
	};

	const ciphermaster = CryptoJS.AES.encrypt(JSON.stringify(master), access_token).toString();
	const ciphertext = CryptoJS.AES.encrypt(
		JSON.stringify(payload.userInfo),
		access_token
	).toString();

	// const { access_token } = payload;
	localStorage.setItem('access_token', access_token);
	localStorage.setItem('userInfo', ciphertext);
	localStorage.setItem('master', ciphermaster);
	// console.log(localStorage.getItem('master').split('/')[0]);
	Http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	const stateObj = {
		...state,
		isAuthenticated: true,
		userInfo: payload.userInfo,
		master
	};
	// const stateObj = {
	//     ...state,
	//     isAuthenticated: true,
	//     user
	// };
	return stateObj;
};

const checkAuth = (state) => {
	let decryptedUserInfo = '';
	let decryptedMaster = '';
	if (localStorage.getItem('access_token')) {
		const userInfoBytes = CryptoJS.AES.decrypt(
			localStorage.getItem('userInfo'),
			localStorage.getItem('access_token')
		).toString(CryptoJS.enc.Utf8);
		decryptedUserInfo = JSON.parse(userInfoBytes);
		const masterBytes = CryptoJS.AES.decrypt(
			localStorage.getItem('master'),
			localStorage.getItem('access_token')
		).toString(CryptoJS.enc.Utf8);
		decryptedMaster = JSON.parse(masterBytes);
	}
	const stateObj = {
		...state,
		isAuthenticated: !!localStorage.getItem('access_token'),
		userInfo: decryptedUserInfo,
		master: decryptedMaster
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
