import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';

export const useDetailsRetriever = () => {
	const [detailState, setDetail] = useState({});
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const response = await Http.get('/api/details');
				const { data } = response;
				if (mounted) {
					setDetail(data);
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
	});
	return [detailState, setDetail];
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
