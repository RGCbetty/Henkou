import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Spin } from 'antd';
import { ManageUserColumns } from '../components/SettingsComponents/ManageUserSettings';
import { useUsersRetriever } from '../api/users';
import Http from '../Http';

const Users = ({ title, ...rest }) => {
	const [users, SetUsers] = useUsersRetriever();
	const { data, pagination, loading } = users;
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const confirm = (user) => {
		user.is_registered = 1;
		Http.post('/api/verify', user).then((res) => console.warn(res));
		users.data[users.data.findIndex((item) => item.id == user.id)] = user;
		const [...usersClone] = users.data;
		SetUsers({
			...users,
			data: usersClone
		});
	};
	const handleTableChange = (page, filters, sorter) => {
		SetUsers({
			...users,
			pagination: {
				...page,
				showTotal: (total) => `Total ${total} items`
			}
		});
	};
	return (
		<>
			{/* <div className="manage_users" /> */}
			<h1 className="title-page">Manage Users</h1>
			<Spin spinning={loading}>
				<Table
					rowKey={(record) => record.id}
					style={{ margin: 10 }}
					columns={ManageUserColumns(confirm)}
					dataSource={data}
					pagination={pagination}
					onChange={handleTableChange}
					bordered></Table>
			</Spin>
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Users);
