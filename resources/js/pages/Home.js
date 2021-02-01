import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import Legend from '../components/HomeComponents/Legend';
import HomeTable from '../components/HomeComponents/HomeTable';
import Legend from '../components/HomeComponents/Legend';
import FilterContainer from '../components/HomeComponents/FilterContainer';

const Home = ({ title, ...rest }) => {
	const [state, setState] = useState({
		department: '',
		section: '',
		team: ''
	});
	const { department, section, team } = state;
	const handleChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	// useEffect(() => {
	//     const fetchUser = async () => {
	//         const userData = JSON.parse(localStorage.getItem('user'));
	//         const { employee_no } = userData;
	//         let response = await Http.get(`/api/userinfo/${employee_no}`);
	//         const { DepartmentName, SectionName, TeamName } = response.data[0];
	//         console.log(DepartmentName, SectionName, TeamName);

	//         setState({
	//             department: DepartmentName,
	//             section: SectionName,
	//             team: TeamName
	//         });
	//     };
	//     fetchUser();
	// }, []);
	const columns = [
		{
			id: '1',
			field: 'reg_data',
			headerName: 'Registration Date',
			type: 'date',
			width: '20%'
		},
		{ id: '2', field: 'rec_date', headerName: 'Received Date', type: 'date', width: '20%' },
		{ id: '3', field: 'dep', headerName: 'Department', width: '20%' },
		{ id: '4', field: 'sec', headerName: 'Section', width: '20%' },
		{ id: '5', field: 'team', headerName: 'Team', width: '20%' }
	];
	const rows = [
		{
			id: '1',
			reg_data: '10/17/2019',
			rec_date: '12/27/2019',
			dep: 'Jon',
			team: 35,
			sec: 'test'
		},
		{
			id: '2',
			reg_data: '08/06/2018',
			rec_date: '11/30/2020',
			dep: 'Cersei',
			team: 42,
			sec: 'test'
		}
	];

	return (
		<>
			<FilterContainer></FilterContainer>
			<div style={{ padding: 5 }}>
				<div style={{ textAlign: 'right' }}>
					<Legend></Legend>
				</div>
				<HomeTable
					products={[
						{ id: 1, name: 'Cheese', price: 4.9, stock: 20 },
						{ id: 2, name: 'Milk', price: 1.9, stock: 32 },
						{ id: 3, name: 'Yoghurt', price: 2.4, stock: 12 },
						{ id: 4, name: 'Heavy Cream', price: 3.9, stock: 9 },
						{ id: 5, name: 'Butter', price: 0.9, stock: 99 },
						{ id: 6, name: 'Sour Cream ', price: 2.9, stock: 86 },
						{ id: 7, name: 'Fancy French Cheese 🇫🇷', price: 99, stock: 12 }
					]}
				/>
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.user
});

export default connect(mapStateToProps)(Home);
