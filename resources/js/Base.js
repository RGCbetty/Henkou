/* Utils */
import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from './redux/actions/auth';
import { Link, useHistory, useLocation } from 'react-router-dom';
/* Utils */
import { Layout, Menu, Avatar, Row, Col, Typography, Dropdown, Button } from 'antd';
import {
	HomeOutlined,
	FolderAddOutlined,
	FileSyncOutlined,
	FileSearchOutlined,
	UserOutlined,
	StopOutlined,
	SettingFilled,
	LogoutOutlined
} from '@ant-design/icons';
import Icon from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const Base = ({ children, dispatch, ...rest }) => {
	const handleLogout = (e) => {
		dispatch(actions.authLogout());
		window.location.href = `http://${window.location.host}/`;
	};
	const location = useLocation();
	const { pathname } = location;
	const drawerItems = [
		{ title: 'Home', url: '/', icon: <HomeOutlined /> },
		{ title: 'Registration', url: '/registration', icon: <FolderAddOutlined /> },
		{ title: 'Henkou', url: '/henkou', icon: <FileSyncOutlined /> },
		{ title: 'Search', url: '/search', icon: <FileSearchOutlined /> },
		{ title: 'Stop', url: '/stop', icon: <StopOutlined /> }
	];
	const menu = (
		<Menu>
			{rest.userInfo.access_level == 1 && (
				<Menu.ItemGroup title="Settings">
					<Menu.Item key="0">
						<Link to="/master">
							<SettingFilled />
							Master Maintenance
						</Link>
					</Menu.Item>
					<Menu.Divider />
					<Menu.Item key="1">
						<Link to="/users">
							<UserOutlined />
							Manage Users
						</Link>
					</Menu.Item>
				</Menu.ItemGroup>
			)}
			<Menu.Divider />
			<Menu.Item icon={<LogoutOutlined />} key="3" onClick={handleLogout}>
				Logout
			</Menu.Item>
		</Menu>
	);
	return (
		<Layout
			hasSider={true}
			style={{
				minHeight: '100vh'
			}}>
			<Sider
				id="components-layout-demo-responsive"
				// breakpoint="lg"
				// collapsedWidth="0"
				style={{
					overflow: 'auto',
					height: '100vh',
					position: 'fixed',
					left: 0,
					zIndex: 1
				}}
				// collapsed
				// onBreakpoint={broken => {
				//     console.log(broken);
				// }}
				// onCollapse={(collapsed, type) => {
				//     console.log(collapsed, type);
				// }}
			>
				<div className="logo" />
				<div className="avatar">
					{/* <Avatar
						src={`http://adminsql1/photos/${rest.userInfo.EmployeeCode}.jpg`}
						size="large"
						style={{ verticalAlign: 'center' }}
					/>
					<p>{rest.userInfo.EmployeeName} Encoder</p> */}
					<span>Department</span>
					<p style={{ verticalAlign: 'top' }}>{rest.userInfo.DepartmentName}</p>
					{rest.userInfo.SectionName ? (
						<>
							<span>Section</span>
							<p style={{ verticalAlign: 'middle' }}>{rest.userInfo.SectionName}</p>
						</>
					) : null}
					{rest.userInfo.TeamName ? (
						<>
							<span>Team</span>
							<p style={{ verticalAlign: 'bottom' }}>{rest.userInfo.TeamName}</p>
						</>
					) : null}
				</div>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={[pathname]}
					selectedKeys={[pathname]}>
					{drawerItems
						.filter((item) => {
							if (rest.userInfo.access_level == 2) {
								if (item.title == 'Registration') {
									return false;
								}
							}
							return true;
						})
						.map((item) => (
							<Menu.Item key={item.url} icon={item.icon}>
								<Link to={item.url}>{item.title}</Link>
							</Menu.Item>
						))}
				</Menu>
			</Sider>
			<Layout style={{ marginLeft: 200 }}>
				<Header
					className="site-layout-sub-header-background"
					style={{
						paddingLeft: 15,
						paddingRight: 15
					}}>
					<Row>
						<Col id="col_title" span={9} style={{ textAlign: 'left' }}>
							<div className="project_title"></div>
							{/* <Title level={3} style={{ margin: 0, marginTop: 15 }}>
								HRD Henkou 1.0.0
							</Title> */}
						</Col>
						<Col span={15} style={{ textAlign: 'right' }}>
							<Dropdown overlay={menu} trigger={['click']}>
								<Button
									shape="round"
									onClick={(e) => e.preventDefault()}
									icon={
										<Icon
											component={() => (
												<Avatar
													size="small"
													style={{ margin: '-5px 0px 0px 0px' }}
													// http://asd_sql/photos/38610.jpg

													src={`http://asd_sql/photos/${rest.userInfo.EmployeeCode}.jpg`}
													// src={`http://hrdapps68:3001/ftp/employee_pictures/${rest.userInfo.EmployeeCode}.jpg`}
												></Avatar>
												// <img
												// 	src={`http://adminsql1/photos/${rest.userInfo.EmployeeCode}.jpg`}
												// />
											)}
										/>
									}
									size="middle">
									{rest.userInfo.EmployeeName}
								</Button>
								{/* <Avatar
                                    size={{ xs: 35, sm: 38, md: 39, lg: 42, xl: 45, xxl: 55 }}
                                    icon={<UserOutlined />}
                                    onClick={e => e.preventDefault()}
                                /> */}
							</Dropdown>
						</Col>
					</Row>
				</Header>
				<Content
					className="site-layout-background"
					style={{ margin: '8px 8px 0', overflow: 'auto' }}>
					{children}
				</Content>
				<Footer style={{ textAlign: 'center' }}>Henkou ©2020 Created by SD-2A</Footer>
			</Layout>
		</Layout>
	);
};
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(React.memo(Base));
