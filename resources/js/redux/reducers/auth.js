import { AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT } from '../types';
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
    const { access_token, user } = payload;
    // const { access_token } = payload;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    Http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    const stateObj = {
        ...state,
        isAuthenticated: true,
        user
    };
    // const stateObj = {
    //     ...state,
    //     isAuthenticated: true,
    //     user
    // };
    return stateObj;
};

const checkAuth = state => {
    const stateObj = {
        ...state,
        isAuthenticated: !!localStorage.getItem('access_token'),
        user: JSON.parse(localStorage.getItem('user'))
    };
    if (state.isAuthenticated) {
        Http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
            'access_token'
        )}`;
    }
    return stateObj;
};

const logout = state => {
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
