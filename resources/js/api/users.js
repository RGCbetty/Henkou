import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useUsersRetriever = () => {
	const [users, setUsers] = useState({
		data: [],
		loading: true
	});
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const response = await Http.get('/api/henkou/users');
				if (mounted) {
					setUsers({
						data: response.data,
						loading: false
					});
				}
			} catch (error) {
				if (Http.isCancel(error)) {
					console.error(error);
				} else {
					throw error;
				}
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return [users, setUsers];
};
export const fetchDetails = async (constructionCode) => {
	try {
		const response = await Http.get(`/api/details/${constructionCode}`);
		const { data } = response;
		if (data) {
			return data;
		}
	} catch (err) {
		console.error(err);
	}
};
