import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../sass/loginform.scss';
import Http from '../Http';
import * as api from '../api/auth';
import { Form, Input, Button, Checkbox, message, Col, Card, Spin } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
const Login = (props) => {
	const [loadingState, setLoadingState] = useState(false);
	// const history = useHistory();
	const { state } = props.location;
	const { from } = state || { from: { pathname: '/' } };
	const { dispatch, isAuthenticated } = props;
	if (isAuthenticated) {
		return <Redirect to={from} />;
	}
	console.log(props);
	useEffect(() => {
		document.title = 'Henkou System';
	}, [props.title]);

	const handleSubmitForm = async (formData) => {
		setLoadingState(true);
		await Http.get('/sanctum/csrf-cookie');
		try {
			const result = await dispatch(api.login(formData));
			console.log(result);
			window.location.href = `http://${window.location.host}/`;
			// let res = await Http.get('/api/user');
			// console.log(res);
			if (result.status_code == 500) throw result.message;
			// dispatch('/');
		} catch (e) {
			if (e == 'Unauthorized') {
				message.error(e + '! Incorrect credentials.');
			}
			setLoadingState(false);
		}
	};
	const handleSubmit = (event) => {
		console.log(event);
		event.preventDefault();
	};
	return (
		<div className="form">
			<div className="shape shape1"></div>

			<div className="shape shape2"></div>

			<div className="login login__form">
				<div className="container cont__login">
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{ remember: false }}
						onFinish={handleSubmitForm}>
						<Form.Item
							name="employee_no"
							rules={[{ required: true, message: 'Please input your Username!' }]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item>
							<Form.Item
								noStyle
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
							<a href="">Forgot password?</a>
						</Form.Item>

						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox style={{ float: 'left' }}>Remember me</Checkbox>
						</Form.Item>

						<Form.Item>
							<Button
								style={{ float: 'right' }}
								type="primary"
								htmlType="submit"
								className="login-form-button">
								Log in
							</Button>

							{/* Or <a href="">register now!</a> */}
						</Form.Item>
					</Form>
				</div>
			</div>

			{/* <div className="register login__form">
				<div className="container__register">
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{ remember: false }}
						onFinish={handleSubmit}>
						<Form.Item
							name="employee_no"
							rules={[{ required: true, message: 'Please input your Username!' }]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="employee_no"
							rules={[{ required: true, message: 'Please input your Username!' }]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="employee_no"
							rules={[{ required: true, message: 'Please input your Username!' }]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your Password!' }]}>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Password"
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								style={{ float: 'right' }}
								htmlType="submit"
								className="login-form-button">
								Register
							</Button>
							Or <a href="">register now!</a>
						</Form.Item>
					</Form>
				</div>
			</div> */}

			<div className="cta">
				<h2 className="cta__heading">HRD Henkou 1.0.0</h2>
				<p className="cta__text">
					Remake of Henkou System(MS Access). Objective: To detail the process in
					receiving and releasing of henkou requests for both jikugumi and wakugumi plans.
				</p>
				<Link
					to={{
						pathname: '/signup',
						state: from
					}}>
					<button className="btn cta__btn">
						<p className="cta__btn--text1">Don't have an account?</p>
						<p className="cta__btn--text2">Click here to register.</p>
					</button>
				</Link>
			</div>
		</div>
	);
};
Login.propTypes = {
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
export default connect(mapStateToProps)(Login);
