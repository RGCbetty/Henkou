import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import Legend from '../components/HomeComponents/Legend';
import HomeColumn from '../components/HomeComponents/HomeColumn';
import Legend from '../components/Legend';
import FilterContainer from '../components/HomeComponents/FilterContainer';
import Http from '../Http';
import moment from 'moment';
import { Plans } from '../utils/HenkouPlans';
import { Table, Spin, Typography } from 'antd';

const dateFormat = 'YYYY/MM/DD';
const Home = ({ title, ...rest }) => {
	const [selectedState, setSelectedState] = useState({
		sections: [],
		teams: []
	});
	const [state, setState] = useState({
		plans: [],
		loading: false
	});

	const { plans, loading } = state;
	const { master, userInfo } = rest;
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setState({
					...state,
					loading: true
				});
				const plans = await Plans.get(
					'api/henkou/plans',
					{
						from: moment
							.utc()
							.local()
							.startOf('d')
							.format(),
						to: moment
							.utc()
							.local()
							.endOf('d')
							.format(),
						// department_id: rest.userInfo.DepartmentCode,
						// section_id: rest.userInfo.SectionCode,
						// team_id: rest.userInfo.TeamCode,
						customer_code: null,
						department_id: userInfo.DepartmentCode,
						section_id: '00469',
						team_id: '00230',
						status_type_id: 2,
						method: null,
						henkou_type_id: null,
						plan_status_id: null
					},
					master
				);
				const sections = await Http.get('api/department/{dep_id}/sections', {
					params: { dep_id: userInfo.DepartmentCode }
				});
				const teams = await Http.get('api/department/{dep_id}/section/{sec_id}/teams', {
					params: {
						dep_id: userInfo.DepartmentCode,
						sec_id: userInfo.SectionCode
					}
				});
				if (mounted) {
					setSelectedState({
						sections: sections.data,
						teams: teams.data
					});

					setState({
						plans,
						loading: false
					});
				}
			} catch (err) {
				console.error(err);
				setState({
					...state,
					loading: false
				});
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	const handleFetchPlans = async (form) => {
		setState({
			...state,
			loading: true
		});
		const plans = await Plans.get(
			'api/henkou/plans',
			{
				from: form
					.getFieldValue('DateToFilter')[0]
					.utc()
					.local()
					.startOf('d')
					.format(),
				to: form
					.getFieldValue('DateToFilter')[1]
					.utc()
					.local()
					.endOf('d')
					.format(),
				customer_code: form.getFieldValue('CustomerCode'),
				department_id: form.getFieldValue('DepartmentName'),
				section_id: form.getFieldValue('SectionName'),
				team_id: form.getFieldValue('TeamName'),
				status_type_id: form.getFieldValue('status_type'),
				method: form.getFieldValue('house_type'),
				henkou_type_id: form.getFieldValue('type_name'),
				plan_status_id: form.getFieldValue('plan_status_name')
			},
			master
		);
		setState({
			plans,
			loading: false
		});
	};
	const handleSelectOnChange = async (title, form) => {
		await handleFetchPlans(form);
		switch (title) {
			case 'Date Range':
				break;
			case 'Department':
				form.setFieldsValue({
					SectionName: null,
					TeamName: null
				});
				const sections = await Http.get('api/department/{dep_id}/sections', {
					params: { dep_id: form.getFieldValue('DepartmentName') }
				});
				setSelectedState({
					...selectedState,
					sections: sections.data
				});
				break;
			case 'Section':
				form.setFieldsValue({
					TeamName: null
				});
				const teams = await Http.get('api/department/{dep_id}/section/{sec_id}/teams', {
					params: {
						dep_id: form.getFieldValue('DepartmentName'),
						sec_id: form.getFieldValue('SectionName')
					}
				});
				setSelectedState({
					...selectedState,
					teams: teams.data
				});
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
	const handleOnEnterCustomerCode = async (form) => {
		setState({
			...state,
			loading: true
		});
		const plans = await Plans.get(
			'api/henkou/plans',
			{
				from: form.DateToFilter[0]
					.utc()
					.startOf('d')
					.format(),
				to: form.DateToFilter[1]
					.utc()
					.endOf('d')
					.format(),
				customer_code: form.CustomerCode,
				department_id: form.DepartmentName,
				section_id: form.SectionName,
				team_id: form.TeamName,
				status_type_id: form.status_type,
				method: form.house_type,
				henkou_type_id: form.type_name,
				plan_status_id: form.plan_status_name
			},
			master
		);
		setState({
			plans,
			loading: false
		});
	};
	useEffect(() => {
		document.title = title || null;
	}, [title]);

	return (
		<>
			<Spin tip="Loading..." wrapperClassName="ant-advanced-search-form" spinning={loading}>
				<FilterContainer
					events={{
						handleSelectOnChange,
						handleOnEnterCustomerCode,
						handleFetchPlans,
						selectedState
					}}>
					<div style={{ padding: 5 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div className="title-page">Henkou Plans</div>
							{/* <Typography.Title
								level={4}
								style={{
									margin: 0,
									display: 'inline-block',
									verticalAlign: 'top'
								}}>
								Henkou Plans
							</Typography.Title> */}
							<div
								style={{
									display: 'inline-block',
									verticalAlign: 'right',
									margin: '10px 0px 0px 0px'
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
						{/* <HomeTable /> */}
						<Table
							rowClassName={(record, index) => {
								if (record.start_date && record.finished_date) {
									return 'table-row-finished';
								} else if (
									record.start_date &&
									!record.finished_date &&
									record.pending_reason == '-'
								) {
									return 'table-row-on-going';
								} else if (
									record.pending.length > 0 &&
									record.start_date &&
									!record.finished_date
								) {
									return 'table-row-pending';
								} else {
									return 'table-row-not-yet-started';
								}
							}}
							columns={HomeColumn()}
							rowKey={(row) => row.id}
							bordered
							dataSource={plans}
							scroll={{ x: 'max-content' }}
						/>
					</div>
				</FilterContainer>
			</Spin>
		</>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});

export default connect(mapStateToProps)(Home);
