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
const Home = ({ title, user }) => {
	const [state, setState] = useState({
		plans: [],
		departments: [],
		sections: [],
		teams: [],
		planType: [],
		planStatus: [],
		loading: false
	});

	// useEffect(() => {
	// 	// Update the document title using the browser API
	// 	// const products = await Http.get(`/api/master/products`);
	// 	// const affectedProducts = await Http.get('/api/master/products/planstatus');
	// 	// const thAssessments = await Http.get('/api/master/THassessments');
	// 	// const thActions = await Http.get('/api/master/actions');
	// 	// const reasons = await Http.get(`/api/master/reasons`);
	// }, []);

	const { plans, loading } = state;
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setState((prevState) => {
					return {
						...prevState,
						loading: true
					};
				});
				const { data, status } = await Http.get('api/henkou/plans', {
					params: {
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
						// department_id: rest.user.DepartmentCode,
						// section_id: rest.user.SectionCode,
						// team_id: rest.user.TeamCode,
						customer_code: null,
						department_id: user.DepartmentCode,
						section_id: user.SectionCode,
						team_id: user.TeamCode,
						status_type_id: 2,
						method: null,
						henkou_type_id: null,
						plan_status_id: null
					}
				});
				const plans = Plans.mapAPI(data);
				const { data: departments } = await Http.get('/api/master/departments');
				// const sections = await Http.get('/api/master/sections');
				// const teams = await Http.get('/api/master/teams');
				const { data: planStatus } = await Http.get('/api/master/planstatuses');
				const { data: planType } = await Http.get(`/api/master/types`);

				const { data: sections } = await Http.get('/api/department/{dep_id}/sections', {
					params: { dep_id: user.DepartmentCode }
				});
				const { data: teams } = await Http.get(
					'/api/department/{dep_id}/section/{sec_id}/teams',
					{
						params: {
							dep_id: user.DepartmentCode,
							sec_id: user.SectionCode
						}
					}
				);
				if (mounted) {
					setState((prevState) => {
						return {
							...prevState,
							plans,
							departments,
							sections,
							teams,
							planType,
							planStatus,
							loading: false
						};
					});
				}
			} catch (err) {
				console.error(err);
				setState((prevState) => {
					return {
						...prevState,
						loading: false
					};
				});
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	const handleFetchPlans = async (form) => {
		// setState((prevState) => {
		// 	return {
		// 		...prevState,
		// 		loading: true
		// 	};
		// });
		const { data, status } = await Http.get('api/henkou/plans', {
			params: {
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
			}
		});
		const plans = Plans.mapAPI(data);
		setState((prevState) => {
			return {
				...prevState,
				plans,
				loading: false
			};
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
				const { data: sections } = await Http.get('api/department/{dep_id}/sections', {
					params: { dep_id: form.getFieldValue('DepartmentName') }
				});
				setState((prevState) => {
					return {
						...prevState,
						sections,
						loading: false
					};
				});
				break;
			case 'Section':
				form.setFieldsValue({
					TeamName: null
				});
				const { data: teams } = await Http.get(
					'api/department/{dep_id}/section/{sec_id}/teams',
					{
						params: {
							dep_id: form.getFieldValue('DepartmentName'),
							sec_id: form.getFieldValue('SectionName')
						}
					}
				);
				setState((prevState) => {
					return {
						...prevState,
						teams,
						loading: false
					};
				});
				break;
			case 'Team':
				break;
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
		// setState({
		// 	...state,
		// 	loading: true
		// });
		const { data } = await Http.get('api/henkou/plans', {
			params: {
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
			}
		});
		const plans = Plans.mapAPI(data);
		setState((prevState) => {
			return {
				...prevState,
				plans,
				loading: false
			};
		});
	};
	useEffect(() => {
		document.title = title || null;
	}, [title]);
	console.log(process.env.MIX_ASSET_URL);
	return (
		<>
			<Spin tip="Loading..." wrapperClassName="ant-advanced-search-form" spinning={loading}>
				{!loading && (
					<FilterContainer
						props={state}
						events={{
							handleSelectOnChange,
							handleOnEnterCustomerCode,
							handleFetchPlans
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
										record.pendings.length > 0 &&
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
								dataSource={plans.length > 0 ? plans : []}
								scroll={{ x: 'max-content' }}
							/>
						</div>
					</FilterContainer>
				)}
			</Spin>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(Home);
