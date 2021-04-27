import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useUsersRetriever = () => {
	const [users, setUsers] = useState({
		data: [],
		pagination: {
			current: 1,
			pageSize: 8,
			showTotal: ''
		},
		loading: true
	});
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const response = await Http.get('/api/henkou/users');
				const { data } = response;
				if (mounted) {
					setUsers({
						data: data.map((item, index) => {
							let roles = [];
							let role_name = '';
							switch (item.access_level) {
								case 1:
									role_name = 'Administrator';
									break;
								case 2:
									role_name = 'Viewer';
									break;
								case 3:
									role_name = 'Encoder';
									break;
							}
							roles.push(role_name);
							return {
								...item,
								access_level: roles
							};
						}),
						loading: false,
						pagination: {
							...users.pagination,
							total: data.length,
							showTotal: (total) => `Total ${total} items`
							// 200 is mock data, you should read it from server
							// total: data.totalCount,
						}
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
