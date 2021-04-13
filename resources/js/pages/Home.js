import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import Legend from '../components/HomeComponents/Legend';
import HomeTable from '../components/HomeComponents/HomeTable';
import Legend from '../components/Legend';
import FilterContainer from '../components/HomeComponents/FilterContainer';
import Http from '../Http';
import { Spin, Typography } from 'antd';
import {
	useMasterDetails,
	useMasterDepartment,
	useMasterSectionByDepartment,
	useMasterTeamByDepartmentAndSection
} from '../api/master';

const Home = ({ title, ...rest }) => {
	// const [departments, setDepartments] = useMasterDepartment();
	// const [sections, setSections] = useMasterSectionByDepartment(rest.userInfo.DepartmentCode);
	// const [teams, setTeams] = useMasterTeamByDepartmentAndSection(
	// 	rest.userInfo.DepartmentCode,
	// 	rest.userInfo.SectionCode
	// );
	console.log('homeeeeee');
	// const [info, setInfo] = useMasterDetails();
	// const { types } = info;
	const [state, setState] = useState({
		department: '',
		section: '',
		team: ''
	});
	const { department, section, team } = state;
	const handleSelectOnChange = async (value, title, form) => {
		// setState({ ...state, [e.target.name]: e.target.value });
		switch (title) {
			case 'Department':
				const sections = await Http.get('api/department/{dep_id}/sections', {
					params: { dep_id: value }
				});
				form.setFieldsValue({
					SectionName: '',
					TeamName: ''
				});
				setSections(sections.data);
				break;
			case 'Section':
				const teams = await Http.get('api/department/{dep_id}/section/{sec_id}/teams', {
					params: {
						dep_id: form.getFieldValue('DepartmentName'),
						sec_id: value
					}
				});
				form.setFieldsValue({
					TeamName: ''
				});
				setTeams(teams.data);
				break;
			case 'Team':
				break;
			case 'House Type':
				break;
			case 'Henkou Type':
				break;
			case 'Henkou Status':
				break;
			case 'Plan Status':
				break;
		}
		// console.log(value);
	};
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	return (
		<>
			<FilterContainer events={{ handleSelectOnChange }}></FilterContainer>
			<div style={{ padding: 5 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography.Title
						level={4}
						style={{ margin: 0, display: 'inline-block', verticalAlign: 'top' }}>
						Plans
					</Typography.Title>
					<div
						style={{
							display: 'inline-block',
							verticalAlign: 'right'
							// textAlign: 'right'
						}}>
						<Legend
							hideSomeLegends={false}
							title1={'Not yet started'}
							title2={'On Going'}
							title3={'Finished'}
							title4={'Pending'}></Legend>
					</div>
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
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(Home);
