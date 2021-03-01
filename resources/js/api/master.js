import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useMasterDetails = () => {
	const [info, setInfo] = useState({
		types: [],
		reasons: [],
		products: [],
		thAssessments: [],
		thActions: [],
		fetching: true
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const thAssessments = await Http.get('/api/THassessments');
				const types = await Http.get(`/api/types`);
				const products = await Http.get('/api/products');
				const thActions = await Http.get('/api/actions');
				const reasons = await Http.get(`/api/reasons`);

				if (mounted) {
					setInfo({
						thAssessments: thAssessments.data,
						types: types.data,
						reasons: reasons.data,
						products: products.data,
						thActions: thActions.data,
						fetching: false
					});
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [info, setInfo];
};

export const useMasterCompany = () => {
	const [company, setCompany] = useState([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const instance = Http.create({
					baseURL: 'http://adminsql1/api',
					withCredentials: false,
					headers: {
						'master-api': 'db588403f0a1d3b897442a28724166b4'
					}
				});
				const company = await instance.get('/company/department/section/team/hrd');
				if (mounted) {
					setCompany(company.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [company, setCompany];
};
