import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Spin } from 'antd';
import { ManageUserColumns } from '../components/SettingsComponents/ManageUserSettings';
import { useUsersRetriever } from '../api/users';
import Http from '../Http';

const Users = ({ title, ...rest }) => {
	const [users, SetUsers] = useUsersRetriever();
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const confirm = (user) => {
		console.log(users.data);
		user.is_registered = 1;
		Http.post('/api/verify', user).then((res) => console.warn(res));
		const [...usersClone] = users.data;
		usersClone.splice(user.id - 1, 1, user);
		SetUsers({
			...users,
			data: usersClone
		});
		// usersClone.
	};
	return (
		<div id="manage_users_page">
			{/* <div className="manage_users" /> */}
			<h1 className="manage_users">𝘔𝘢𝘯𝘢𝘨𝘦 𝘜𝘴𝘦𝘳𝘴</h1>
			<Spin spinning={users.loading}>
				<Table
					rowKey={(record) => record.id}
					style={{ margin: 10 }}
					columns={ManageUserColumns(confirm)}
					dataSource={users.data}
					bordered></Table>
			</Spin>
		</div>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Users);
