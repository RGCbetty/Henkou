import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';

export const useProductsRetriever = () => {
	// const [products, setProduct] = useState({
	// 	loading: false,
	// 	pagination: {
	// 		current_page: 1,
	// 		per_page: 10
	// 	}
	// });
	const [products, setProduct] = useState({ loading: false, data: [] });
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const productsApi = await fetchProducts(setProduct, products);

				if (mounted) {
					// setProduct({ ...productsApi, ...products });
					setProduct({
						loading: false,
						data: productsApi.map((item) => {
							return { ...item };
						})
					});
				}
			} catch (error) {
				if (Http.isCancel(error)) {
					console.error(error);
				} else {
					console.error(error);
				}
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [products, setProduct];
};
export const fetchProducts = async (setProduct = null, products = null) => {
	setProduct({ loading: true });
	const response = await Http.get('/api/products');
	// console.log(response);

	return response.data;
};
