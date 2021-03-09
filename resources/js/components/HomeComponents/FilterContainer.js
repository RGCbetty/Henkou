import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'react-redux';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Search } = Input;
const { Option } = Select;

const FilterContainer = (props) => {
	const [expand, setExpand] = useState(false);
	const [form] = Form.useForm();
	const { userInfo, types, departments } = props;
	const FilterSelections = () => {
		const count = !expand ? planDetails.length : 0;
		const items = [];
		for (let i = 0; i < count; i++) {
			items.push(
				<Col style={{ textAlign: planDetails[i].textAlign }} span={8} key={i}>
					<Form.Item
						name={planDetails[i].title}
						label={`${planDetails[i].title}`}
						style={{ marginBottom: '0px' }}
						rules={[
							{
								required: true,
								message: 'Input something!'
							}
						]}>
						<Select
							showSearch={planDetails[i].showSearch}
							// defaultValue={planDetails[i].defaultValue}
							style={{ width: planDetails[i].width }}>
							{planDetails[i].items.length > 0
								? planDetails[i].items.map((item) => {
										return (
											<Option
												value={item.DepartmentCode}
												key={item.DepartmentCode}>
												{item.DepartmentName}
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
					width: 250,
					textAlign: 'left',
					showSearch: true,
					items: departments,
					code: 'DepartmentCode'
				},
				{
					title: 'Section',
					width: 150,
					textAlign: 'center',
					showSearch: true,
					items: []
				},
				{
					title: 'Team',
					width: 200,
					textAlign: 'right',
					showSearch: true,
					items: []
				},
				{
					title: 'House Type',
					width: 200,
					textAlign: 'left',
					items: [{}]
				},
				{
					title: 'Henkou Type',
					width: 250,
					textAlign: 'center',
					items: []
				},
				{
					title: 'Status',
					width: 200,
					textAlign: 'right',
					items: []
				}
		  ]
		: [];
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};

	return (
		<Form
			form={form}
			name="advanced_search"
			initialValues={{
				Department: userInfo.DepartmentCode,
				Section: userInfo.SectionCode,
				Team: userInfo.TeamCode
			}}
			className="ant-advanced-search-form"
			onFinish={onFinish}>
			<Row gutter={[10, 10]}>
				<Col span={8}>
					<Search
						placeholder="Enter Code"
						allowClear
						addonBefore="Customer Code"
						style={{ width: 300, margin: '0 0' }}></Search>
				</Col>
				<Col span={8} style={{ textAlign: 'center', padding: '10 0 0 0' }}>
					Home Page
				</Col>
				<Col span={8} style={{ textAlign: 'right' }}>
					<RangePicker
						defaultValue={[
							moment(moment().format(dateFormat), dateFormat),
							moment(moment().format(dateFormat), dateFormat)
						]}
						format={dateFormat}
					/>
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
							form.resetFields();
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
		</Form>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(FilterContainer);
