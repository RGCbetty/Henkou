import { AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT } from '../types';

export const authLogin = payload => ({
    type: AUTH_LOGIN,
    payload
});

export const authLogout = () => ({
    type: AUTH_LOGOUT
});

export const authCheck = () => ({
    type: AUTH_CHECK
});

export const productCategories = () => ({
    type: PRODUCT_CATEGORIES
});
