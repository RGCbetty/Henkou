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
	const { userInfo, events, master } = props;
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
						rules={[
							{
								required: true,
								message: 'Input something!'
							}
						]}>
						<Select
							showSearch={planDetails[i].showSearch}
							// defaultValue={planDetails[i].defaultValue}
							onChange={(value) =>
								events.handleSelectOnChange(value, planDetails[i].title, form)
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
					items: master.departments,
					code: 'DepartmentCode',
					name: 'DepartmentName'
				},
				{
					title: 'Section',
					textAlign: 'center',
					showSearch: true,
					items: master.sections.length == 0 ? master.sections : master.sections,
					code: 'SectionCode',
					name: 'SectionName'
				},
				{
					title: 'Team',
					textAlign: 'right',
					showSearch: true,
					items: master.teams.length == 0 ? master.teams : master.teams,
					code: 'TeamCode',
					name: 'TeamName'
				},
				{
					title: 'House Type',
					width: 200,
					textAlign: 'left',
					items: [
						{ id: 1, house_type: 'All' },
						{ id: 2, house_type: 'Wakugumi' },
						{ id: 3, house_type: 'Jikugumi' }
					],
					code: 'id',
					name: 'house_type'
				},
				{
					title: 'Henkou Type',
					width: 200,
					textAlign: 'center',
					items:
						master.types.length == 0
							? [{ id: 0, type_name: 'All' }]
							: [{ id: 0, type_name: 'All' }, ...master.types],
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
						{ id: 3, status_type: 'Pending' },
						{ id: 4, status_type: 'Finished' }
					],
					code: 'id',
					name: 'status_type'
				},

				{
					title: 'Plan Status',
					width: 250,
					textAlign: 'right',
					items: [{ id: 0, plan_status_name: 'All' }, ...master.planstatus],
					code: 'id',
					name: 'plan_status_name'
				}
		  ]
		: [];
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};

	return (
		<Form
			preserve={false}
			form={form}
			name="advanced_search"
			initialValues={{
				DepartmentName: userInfo.DepartmentCode,
				SectionName: userInfo.SectionCode,
				TeamName: userInfo.TeamCode,
				house_type: 1,
				type_name: 0,
				status_type: 2,
				plan_status_name: 0
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

				<Col offset={8} span={8} style={{ textAlign: 'right' }}>
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
	userInfo: state.auth.userInfo,
	master: state.auth.master
});

export default connect(mapStateToProps)(FilterContainer);
