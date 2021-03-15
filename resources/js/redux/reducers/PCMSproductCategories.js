import { PRODUCT_CATEGORIES } from '../types';
import Http from '../../Http';

const initialState = {
	products: []
};

const productCategories = (state, payload) => {};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case PRODUCT_CATEGORIES:
			return productCategories(state, payload);
		default:
			return state;
	}
};
