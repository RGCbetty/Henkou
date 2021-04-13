import React, { useEffect } from 'react';
import SearchContainer from '../components/SearchComponents/SearchContainer';

const Search = ({ title }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	// useEffect(() => {
	// 	console.error('testsetset');
	// }, []);
	console.log('search');
	return <SearchContainer></SearchContainer>;
};

export default Search;
