import { SET_MASTER } from '../types';
import CryptoJS from 'crypto-js';
const initialState = {
	products: [],
	company: [],
	departments: [],
	sections: [],
	teams: []
};

const setMaster = (state, payload) => {
	const master = {
		departments: payload.departments,
		sections: payload.sections,
		teams: payload.teams
	};
	const ciphermaster = CryptoJS.AES.encrypt(JSON.stringify(master), 'HenkouMaster').toString();
	localStorage.setItem('master', ciphermaster);
	let decryptedMaster = '';
	const masterBytes = CryptoJS.AES.decrypt(
		localStorage.getItem('master'),
		'HenkouMaster'
	).toString(CryptoJS.enc.Utf8);
	decryptedMaster = JSON.parse(masterBytes);
	const stateObj = {
		...state,
		...decryptedMaster
	};
	return stateObj;
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_MASTER:
			return setMaster(state, payload);
		default:
			return state;
	}
};
