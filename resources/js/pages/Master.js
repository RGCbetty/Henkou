import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { FileSyncOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const Master = ({ routes }) => {
	return (
		<Router>
			<Menu mode="horizontal">
				{routes.map((route, index) => {
					if (index < 2) {
						return (
							<Menu.Item key={index}>
								<Link to={route.path}>
									{route.icon}
									{route.name}
								</Link>
							</Menu.Item>
						);
					}
				})}
				<SubMenu key="SubMenu" icon={<SettingOutlined />} title="Others">
					<Menu.ItemGroup title="TH Options">
						{routes.map((route, index) => {
							if (index > 4) {
								return (
									<Menu.Item key={index}>
										<Link to={route.path}>{route.name}</Link>
									</Menu.Item>
								);
							}
						})}
					</Menu.ItemGroup>
					<Menu.ItemGroup title="Others">
						{routes.map((route, index) => {
							if (index > 1 && index < 4) {
								return (
									<Menu.Item key={index}>
										<Link to={route.path}>{route.name}</Link>
									</Menu.Item>
								);
							}
						})}
					</Menu.ItemGroup>
				</SubMenu>

				{/*
				<Menu.Item key="alipay">
					<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
						Navigation Four - Link
					</a>
				</Menu.Item> */}
			</Menu>
			<Switch>
				{routes.map((route, index) => {
					return (
						<Route
							key={index}
							path={route.path}
							render={(props) => (
								// pass the sub-routes down to keep nesting
								<route.component {...props} />
							)}
						/>
					);
				})}
			</Switch>
		</Router>
	);
};
export default Master;
