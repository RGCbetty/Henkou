import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'react-redux';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Search } = Input;
const { Option } = Select;

const FilterContainer = ({ user, props, events, children }) => {
	const { departments, sections, teams, planType, planStatus, loading } = props;
	const [expand, setExpand] = useState(false);
	const [form] = Form.useForm();
	const FilterSelections = () => {
		const count = !expand ? planDetails.length : 0;
		const items = [];
		for (let i = 0; i < count; i++) {
			items.push(
				<Col style={{ float: planDetails[i].textAlign }} span={8} key={i}>
					<Form.Item
						shouldUpdate
						name={planDetails[i].name}
						label={`${planDetails[i].title}`}
						style={{ marginBottom: '0px' }}
						rules={
							planDetails[i].name !== 'TeamName' &&
							planDetails[i].name !== 'SectionName'
								? [
										{
											required: true,
											message: `${planDetails[i].title} required!`
										}
								  ]
								: null
						}>
						<Select
							showSearch={planDetails[i].showSearch}
							// defaultValue={planDetails[i].defaultValue}
							loading={loading}
							onChange={(value) =>
								events.handleSelectOnChange(planDetails[i].title, form)
							}
							style={{ width: planDetails[i].width }}>
							{planDetails[i].items.length > 0
								? planDetails[i].items.map((item, index) => {
										return (
											<Option
												value={item[planDetails[i].code]}
												key={parseInt(item[planDetails[i].code])}>
												{item[planDetails[i].name]}
											</Option>
										);
								  })
								: null}
							{/* <Option value="jack">Jack</Option>
							<Option value="lucy">Lucy</Option>
							<Option value="disabled" disabled>
								Disabled
							</Option>
							<Option value="Yiminghe">yiminghe</Option> */}
						</Select>
					</Form.Item>
				</Col>
			);
		}
		return items;
	};
	const planDetails = !expand
		? [
				{
					title: 'Department',
					textAlign: 'left',
					showSearch: true,
					items: departments,
					code: 'DepartmentCode',
					name: 'DepartmentName'
				},
				{
					title: 'Section',
					textAlign: 'center',
					showSearch: true,
					items: sections,
					code: 'SectionCode',
					name: 'SectionName'
				},
				{
					title: 'Team',
					textAlign: 'right',
					showSearch: true,
					items: teams,
					code: 'TeamCode',
					name: 'TeamName'
				},
				{
					title: 'House Type',
					width: 200,
					textAlign: 'left',
					items: [
						{ id: 0, house_type: 'All' },
						{ id: 1, house_type: 'Jikugumi' },
						{ id: 2, house_type: 'Wakugumi' }
					],
					code: 'id',
					name: 'house_type'
				},
				{
					title: 'Henkou Type',
					width: 200,
					textAlign: 'center',
					items: [{ id: 0, type_name: 'All' }, ...planType],
					code: 'id',
					name: 'type_name'
				},
				{
					title: 'Henkou Status',
					width: 200,
					textAlign: 'right',
					items: [
						{ id: 1, status_type: 'All' },
						{ id: 2, status_type: 'On-going' },
						{ id: 3, status_type: 'Finished' },
						{ id: 4, status_type: 'Pending' },
						{ id: 5, status_type: 'Not yet started' }
					],
					code: 'id',
					name: 'status_type'
				},

				{
					title: 'Plan Status',
					width: 250,
					textAlign: 'right',
					items: [{ id: 0, plan_status_name: 'All' }, ...planStatus],
					code: 'id',
					name: 'plan_status_name'
				}
		  ]
		: [];
	const onFinish = (values) => {
		events.handleOnEnterCustomerCode(values);
		console.log('Received values of form: ', values);
	};
	const handleSearchInput = (value, form, e) => {
		e.preventDefault();
		form.setFieldsValue({ CustomerCode: value });
		events.handleFetchPlans(form);
	};

	return (
		<Form
			preserve={false}
			form={form}
			name="advanced_search"
			initialValues={{
				DepartmentName: user.DepartmentCode,
				SectionName: user.SectionCode,
				TeamName: user.TeamCode,
				house_type: 0,
				type_name: 0,
				status_type: 2,
				plan_status_name: 0,
				DateToFilter: [
					moment()
						.utc()
						.local()
						.startOf('d'),
					moment()
						.utc()
						.local()
						.endOf('d')
				]
			}}
			className="ant-advanced-search-form"
			onFinish={onFinish}>
			<Row gutter={[10, 10]}>
				<Col span={8}>
					<Form.Item
						shouldUpdate
						name={'CustomerCode'}
						style={{ marginBottom: '0px' }}
						rules={[
							{
								required: true,
								message: 'Input something!'
							}
						]}>
						<Search
							placeholder="Enter Code"
							allowClear
							addonBefore="Customer Code"
							onSearch={(value, e) => handleSearchInput(value, form, e)}
							style={{ width: 300, margin: '0 0' }}></Search>
					</Form.Item>
				</Col>

				<Col offset={8} span={8} style={{ textAlign: 'right' }}>
					<Form.Item
						shouldUpdate
						name={'DateToFilter'}
						style={{ marginBottom: '0px' }}
						rules={[
							{
								required: true,
								message: 'Input something!'
							}
						]}>
						<RangePicker
							// defaultValue={[
							// 	moment(moment().format(dateFormat), dateFormat),
							// 	moment(moment().format(dateFormat), dateFormat)
							// ]}
							// onCalendarChange={(val) => console.log(val, 'onCalendarChange')}
							onChange={() => events.handleSelectOnChange('Date Range', form)}
							inputReadOnly
							format={dateFormat}
						/>
					</Form.Item>
				</Col>
				{FilterSelections()}
			</Row>
			<Row>
				<Col span={16} offset={8} style={{ textAlign: 'right' }}>
					<Button type="primary" htmlType="submit">
						Reports
					</Button>
					<Button
						style={{ margin: '0 8px' }}
						onClick={() => {
							form.setFieldsValue({
								DepartmentName: null,
								SectionName: null,
								TeamName: null,
								house_type: null,
								type_name: null,
								status_type: null,
								plan_status_name: null,
								CustomerCode: null,
								DateToFilter: null
							});
						}}>
						Clear
					</Button>
					<a
						style={{ fontSize: 12 }}
						onClick={() => {
							setExpand(!expand);
						}}>
						{expand ? <UpOutlined /> : <DownOutlined />} Filter Option
					</a>
				</Col>
			</Row>
			{children}
		</Form>
	);
};
const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(FilterContainer);
