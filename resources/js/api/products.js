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
export const useMasterState = (user) => {
	const [state, setState] = useState({
		toSoftDelete: [],
		toUpsert: [],
		loading: true,
		products: [],
		affectedProducts: [],
		planstatus: [],
		selectedPlanStatus: 0,
		designations: [],
		departments: [],
		sections: [],
		teams: []
	});
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const { data, status } = await Http.get(`/api/henkou/master/products`);
				const { products, planstatus, designations } = data;
				// const { data: sections } = await Http.get('/api/department/{dep_id}/sections', {
				// 	params: { dep_id: user.DepartmentCode }
				// });
				// const { data: teams } = await Http.get(
				// 	'/api/department/{dep_id}/section/{sec_id}/teams',
				// 	{
				// 		params: {
				// 			dep_id: user.DepartmentCode,
				// 			sec_id: user.SectionCode
				// 		}
				// 	}
				// );
				if (mounted && status == 200) {
					setState((prevState) => ({
						...prevState,
						loading: false,
						products,
						planstatus,
						designations,
						departments: _.uniqBy(
							designations.map((item) => item.departments),
							'DepartmentCode'
						),
						sections: _.uniqBy(
							designations
								.filter((item) => item.DepartmentCode == user.DepartmentCode)
								.map((item) => item.sections),
							'SectionCode'
						),
						teams: _.uniqBy(
							designations
								.filter(
									(item) =>
										item.DepartmentCode == user.DepartmentCode &&
										item.SectionCode == user.SectionCode
								)
								.map((item) => item.teams),
							'TeamCode'
						)
					}));
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
	return [state, setState];
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
