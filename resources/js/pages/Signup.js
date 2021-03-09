import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../sass/signupform.scss';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Input, message, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import Http from '../Http';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 8 }, lg: { span: 8 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 12 }, lg: { span: 12 } }
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 8,
			offset: 16
		}
	}
};
import { ArrowLeftOutlined } from '@ant-design/icons';
const SignUp = (props) => {
	const { history } = useHistory();
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		console.log('Received values of form: ', values);
		const register = await Http.post(`/api/register`, values);

		if (register.data.status_code == 200) {
			message.success(register.data.message);
			window.location.href = `http://${window.location.host}/`;
		} else {
			message.error(register.data.message);
		}
		form.resetFields();
	};

	const validateMessages = {
		required: '${label} is required!'
	};
	const checkEmployeeCode = async (input) => {
		const fields = form.getFieldsValue();
		const { user } = fields;
		console.log(user);
		if (input.length == 5) {
			const employee = await Http.get(`/api/employee/${input}`);
			console.log(employee);
			if (employee.data.status_code !== 404) {
				form.setFieldsValue({
					user: {
						employeecode: employee.data.EmployeeCode,
						fullname: employee.data.EmployeeName,
						position: employee.data.DesignationName,
						gender:
							employee.data.Gender == 'M'
								? `${employee.data.Gender}ale`
								: employee.data.Gender
								? `${employee.data.Gender}emale`
								: '',
						department: employee.data.DepartmentName,
						section: employee.data.SectionName,
						team: employee.data.TeamName
					}
				});
			} else {
				message.info(employee.data.message);
			}
		} else {
			form.setFieldsValue({
				user: {
					employeecode: '',
					fullname: '',
					position: '',
					gender: '',
					department: '',
					section: '',
					team: ''
				}
			});
			// setUserRequired(true);
			form.validateFields();
		}
	};
	console.log(form);
	useEffect(() => {
		document.title = props.title || '';
	}, [props.title]);
	return (
		<div className="signup_form">
			<div className="signup_header">
				<div className="header_title">Create an Account</div>
			</div>
			<div className="signup_body">
				<Form
					{...formItemLayout}
					form={form}
					name="register"
					onFinish={onFinish}
					validateMessages={validateMessages}
					// onValuesChange={onValuesChange}
				>
					<Row>
						<Col xs={24} sm={24} md={8} lg={7}>
							<Form.Item
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 12 },
									lg: { span: 10 }
								}}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 14 },
									lg: { span: 14 }
								}}
								name={['user', 'employeecode']}
								label="Employee Code"
								rules={[
									{
										required: true
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue(['user', 'employeecode']).length === 5
											) {
												return Promise.resolve();
											}

											return Promise.reject('Invalid employee code!');
										}
									})
								]}>
								<Input
									type="input"
									onInput={(e) =>
										// (this.value = this.value.replace(/[^0-9]/g, '')),
										checkEmployeeCode(e.target.value)
									}
									maxLength={5}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={8}>
							<Form.Item
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 8 },
									lg: { span: 10 }
								}}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 14 },
									lg: { span: 14 }
								}}
								name={['user', 'password']}
								label="Password"
								rules={[
									{
										required: true
									}
								]}
								hasFeedback>
								<Input.Password />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={9}>
							<Form.Item
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 14 },
									lg: { span: 10 }
								}}
								name={['user', 'confirm']}
								label="Password"
								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue(['user', 'password']) === value
											) {
												return Promise.resolve();
											}

											return Promise.reject('Password mismatch');
										}
									})
								]}>
								<Input.Password />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col xs={24} sm={24} md={8} lg={9}>
							<Form.Item
								label="Full Name"
								name={['user', 'fullname']}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 16 },
									lg: { span: 16 }
								}}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 8 },
									lg: { span: 6 }
								}}
								rules={[
									{
										required: true
									}
								]}
								hasFeedback>
								<Input readOnly />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={7}>
							<Form.Item
								label="Position"
								name={['user', 'position']}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 16 },
									lg: { span: 16 }
								}}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 6 },
									lg: { span: 6 }
								}}
								rules={[
									{
										required: true
									}
								]}
								hasFeedback>
								<Input readOnly />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={8}>
							<Form.Item
								label="Gender"
								name={['user', 'gender']}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 10 },
									lg: { span: 8 }
								}}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 14 },
									lg: { span: 14 }
								}}
								rules={[
									{
										required: true
									}
								]}
								hasFeedback>
								<Input readOnly />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col xs={24} sm={24} md={8} lg={7}>
							<Form.Item
								name={['user', 'department']}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 8 },
									lg: { span: 8 }
								}}
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 16 },
									lg: { span: 16 }
								}}
								label="Department"
								rules={[
									{
										required: true
									}
								]}
								hasFeedback>
								<Input readOnly />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={8}>
							<Form.Item
								name={['user', 'section']}
								label="Section"
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 18 },
									lg: { span: 18 }
								}}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 6 },
									lg: { span: 6 }
								}}>
								<Input readOnly />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={8} lg={9}>
							<Form.Item
								name={['user', 'team']}
								label="Team"
								wrapperCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 20 },
									lg: { span: 18 }
								}}
								labelCol={{
									xs: { span: 24 },
									sm: { span: 24 },
									md: { span: 4 },
									lg: { span: 4 }
								}}>
								<Input readOnly />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item style={{ textAlign: 'right', margin: 5 }} {...tailFormItemLayout}>
						<Form.Item noStyle>
							<Link to={props.location.state.pathname}>
								<Button type="primary" shape="round" icon={<ArrowLeftOutlined />}>
									Login instead
								</Button>
							</Link>
						</Form.Item>
						<Button
							style={{ margin: 10 }}
							type="primary"
							htmlType="submit"
							shape="round">
							Register
						</Button>
					</Form.Item>
				</Form>
			</div>
			{/* <div className="signup_footer">
				<div className="footer_button"></div>
				<div className="footer_button"></div>
			</div> */}
		</div>
	);
};
SignUp.propTypes = {
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
export default connect(mapStateToProps)(withRouter(SignUp));
