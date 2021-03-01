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
	StopOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const Base = ({ children, dispatch, ...rest }) => {
	const handleLogout = (e) => {
		dispatch(actions.authLogout());
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
			<Menu.Item key="0">
				<a href="http://www.alipay.com/">1st menu item</a>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="1">
				<a href="http://www.taobao.com/">2nd menu item</a>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="3" onClick={handleLogout}>
				Logout
			</Menu.Item>
		</Menu>
	);
	return (
		<Layout
			style={{
				height: '100vh'
			}}>
			<Sider
				id="components-layout-demo-responsive"
				breakpoint="lg"
				collapsedWidth="0"
				// onBreakpoint={broken => {
				//     console.log(broken);
				// }}
				// onCollapse={(collapsed, type) => {
				//     console.log(collapsed, type);
				// }}
			>
				<div className="logo" />
				<Menu theme="dark" mode="inline" defaultSelectedKeys={[pathname]}>
					{drawerItems
						.filter((item) => {
							if (
								rest.userInfo.SectionCode !== '465' &&
								rest.userInfo.TeamCode !== '0133'
							) {
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
			<Layout>
				<Header
					className="site-layout-sub-header-background"
					style={{ paddingLeft: 15, paddingRight: 15 }}>
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
									icon={<UserOutlined />}
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
					style={{ margin: '8px 8px 0', overflow: 'auto', backgroundColor: 'white' }}>
					{/* <div className="site-layout-background" style={{ height: '100%' }}> */}
					{children}
					{/* </div> */}
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
