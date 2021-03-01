import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Row, Col, Card, Spin } from 'antd';
import Http from '../Http';
import * as api from '../api/auth';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = (props) => {
	const [loadingState, setLoadingState] = useState(false);
	// const history = useHistory();
	const { state } = props.location;
	const { from } = state || { from: { pathname: '/' } };
	const { dispatch, isAuthenticated } = props;
	if (isAuthenticated) {
		return <Redirect to={from} />;
	}

	const handleSubmitForm = async (formData) => {
		setLoadingState(true);
		await Http.get('/sanctum/csrf-cookie');
		try {
			const result = await dispatch(api.login(formData));
			// let res = await Http.get('/api/user');
			// console.log(res);
			if (result.status_code == 500) throw result.message;
			// dispatch('/');
		} catch (e) {
			console.error(e);
			setLoadingState(false);
		}
	};

	return (
		<Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
			<Col xs={20} sm={16} md={9} lg={7} xl={6}>
				<Spin spinning={loadingState}>
					<Card style={{ textAlign: 'center', width: '100%', margin: 'auto' }}>
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{ remember: false }}
							onFinish={handleSubmitForm}>
							<Form.Item
								name="employee_no"
								rules={[
									{ required: true, message: 'Please input your Username!' }
								]}>
								<Input
									prefix={<UserOutlined className="site-form-item-icon" />}
									placeholder="Username"
								/>
							</Form.Item>
							<Form.Item
								name="password"
								rules={[
									{ required: true, message: 'Please input your Password!' }
								]}>
								<Input
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									placeholder="Password"
								/>
							</Form.Item>
							<Form.Item>
								<Form.Item name="remember" valuePropName="checked" noStyle>
									<Checkbox>Remember me</Checkbox>
								</Form.Item>

								<a className="login-form-forgot" href="">
									Forgot password
								</a>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="login-form-button">
									Log in
								</Button>
								Or <a href="">register now!</a>
							</Form.Item>
						</Form>
					</Card>
				</Spin>
			</Col>
		</Row>
	);
};
LoginForm.propTypes = {
	dispatch: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	location: PropTypes.shape({
		state: PropTypes.shape({
			pathname: PropTypes.string
		})
	})
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(LoginForm);
