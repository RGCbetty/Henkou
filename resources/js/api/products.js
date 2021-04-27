import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';

export const useAffectedProductsRetriever = () => {
	const [affectedProducts, setAffectedProducts] = useState({ loading: false, data: [] });
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const affectedProducts = await Http.get('/api/products/planstatus');

				if (mounted) {
					setAffectedProducts(affectedProducts.data);
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
	return [affectedProducts, setAffectedProducts];
};
export const useProductsRetriever = () => {
	const [products, setProducts] = useState({ loading: true, data: [] });
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const products = await Http.get(`/api/master/products`);

				if (mounted) {
					setProducts({
						loading: false,
						data: products.data
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
	return [products, setProducts];
};

/* BACK UPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
/* export const useProductsRetriever = () => {
	const [products, setProducts] = useState({ loading: false, data: [] });
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const productsApi = await fetchProducts(setProducts, products);

				if (mounted) {
					setProducts({
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
	return [products, setProducts];
};
export const fetchProducts = async (setProducts = null, products = null) => {
	setProducts({ loading: true });
	const response = await Http.get('/api/products');
	// console.log(response);

	return response.data;
}; */
