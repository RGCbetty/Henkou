import React, { useState, useEffect, useLayoutEffect } from 'react';
import Http from '../Http';

export const useActivePlanStatus = () => {
	const [productCategoriesPCMS, setProductCategoriesPCMS] = useState([]);
	useLayoutEffect(() => {
		let mounted = true;
		try {
			(async () => {
				const instance = Http.create({
					baseURL: 'http://hrdapps71:4900/',

					// baseURL: 'http://10.168.64.223:4900/',
					withCredentials: false
					// headers: {
					// 	'master-api': 'db588403f0a1d3b897442a28724166b4'
					// }
				});
				const response = await instance.get('get/getProductListActive?from=plugins');
				if (mounted) {
					setProductCategoriesPCMS(response.data);
				}
			})();
		} catch (err) {
			console.error(err);
		}
		return () => {
			mounted = false;
		};
	}, []);
	return [productCategoriesPCMS, setProductCategoriesPCMS];
};
