import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Select, Typography, DatePicker, Modal } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import HenkouTable from '../HenkouTable';
import moment from 'moment';

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Title } = Typography;
const SearchContainer = () => {
	// useEffect(() => {
	//     const fetchPlans = async () => {
	//         setState({ loading: true });
	//         const response = await Http.get(`/api/plans`, { params: pagination });
	//         const { data, total } = response.data;
	//         let henkouPlans = data.map((item, index) => {
	//             return {
	//                 key: index,
	//                 thview: 'view PDF',
	//                 assessment: [
	//                     'plan detail',
	//                     'location',
	//                     'plan detail & location',
	//                     'PEL',
	//                     'Denki TH'
	//                 ],
	//                 start: 'Start Date',
	//                 action: ['Cancel', 'For CIP', 'Borrow Form', 'Release'],

	//                 ...item
	//             };
	//         });
	//         // setPlans([...plans, data]);
	//         setState({
	//             loading: false,
	//             plans: henkouPlans,
	//             pagination: {
	//                 ...pagination,
	//                 total: total,
	//                 showTotal: total => `Total ${total} items`
	//                 // 200 is mock data, you should read it from server
	//                 // total: data.totalCount,
	//             }
	//         });
	//     };
	//     fetchPlans();
	// }, []);
	const headers = [
		{
			title: 'Revision No.',
			dataIndex: 'regDate',
			key: '1',
			width: 70,
			fixed: 'left'
		},
		{
			title: 'Registration Date',
			dataIndex: 'recDate',
			key: '2',
			width: 70,
			fixed: 'left'
		},
		{
			title: 'Henkou Type',
			dataIndex: 'department',
			key: '3',
			width: 70,
			fixed: 'left'
		},
		{
			title: 'Henkou Reason',
			dataIndex: 'section',
			key: '4',
			width: 70,
			fixed: 'left'
		},
		{
			title: 'Henkou Details',
			dataIndex: 'team',
			key: '5',
			width: 70,
			fixed: 'left'
		},
		{
			title: 'Start',
			key: '6',
			width: 70,
			dataIndex: 'customerCode'
		},
		{
			title: 'Pending',
			key: '7',
			width: 70,
			dataIndex: 'houseCode'
		},
		{
			title: 'Finish',
			key: '8',
			width: 70,
			dataIndex: 'houseType'
		},
		{
			title: 'Days in Process',
			key: '9',
			width: 70,
			dataIndex: 'henkouType'
		}
	];
	const [visible, setVisible] = useState(false);
	const [expand, setExpand] = useState(false);
	const [form] = Form.useForm();
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};
	const onEnter = (e) => {
		setExpand(true);
	};
	const planDetails = [
		{
			title: 'House Code',
			width: 200,
			textAlign: 'center'
		},
		{
			title: 'Joutou Date',
			width: 250,
			textAlign: 'center'
		},

		{
			title: 'House Type',
			width: 200,
			textAlign: 'center'
		},

		{
			title: 'Kiso Start',
			width: 250,
			textAlign: 'center'
		}
	];

	return (
		<>
			<Form
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={onFinish}>
				<Row gutter={[10, 10]}>
					<Col span={8}>
						<Search
							placeholder="Enter Code"
							allowClear
							onPressEnter={onEnter}
							addonBefore="Customer Code"
							style={{ width: 300, margin: '0 0' }}></Search>
					</Col>
					<Col span={8} style={{ textAlign: 'center', padding: '10 0 0 0' }}>
						Search Plan
					</Col>
					<Col span={8} style={{ textAlign: 'right' }}>
						<DatePicker
							defaultValue={moment(moment().format('YYYY-MM-DD'), dateFormat)}
							disabled
							format={dateFormat}
						/>
					</Col>
					{expand
						? planDetails.map((item, index) => (
								<Col style={{ textAlign: item.textAlign }} span={12} key={index}>
									<Form.Item
										style={{ marginBottom: '0px' }}
										rules={[
											{
												required: true,
												message: 'Input something!'
											}
										]}>
										<Input
											value={item.value}
											addonBefore={item.title}
											style={{ width: item.width }}
										/>
									</Form.Item>
								</Col>
						  ))
						: null}
					{/* {getFields()} */}
				</Row>
				<Row gutter={[10, 10]}>
					<Col span={24} style={{ textAlign: 'right' }}>
						<a
							style={{ fontSize: 12 }}
							onClick={() => {
								setExpand(!expand);
							}}>
							{expand ? <UpOutlined /> : <DownOutlined />} Collapse
						</a>
					</Col>
				</Row>
			</Form>
			<div style={{ padding: 5 }}>
				<HenkouTable headers={headers} />
			</div>
		</>
	);
};

export default SearchContainer;
