import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Search } = Input;
const { Option } = Select;

const FilterContainer = () => {
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();

    const FilterSelections = () => {
        const count = expand ? planDetails.length : 0;
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push(
                <Col style={{ textAlign: planDetails[i].textAlign }} span={8} key={i}>
                    <Form.Item
                        name={`field-${i}`}
                        label={`${planDetails[i].title}`}
                        style={{ marginBottom: '0px' }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!'
                            }
                        ]}>
                        <Select defaultValue="lucy" style={{ width: 120 }}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                                Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </Form.Item>
                </Col>
            );
        }
        return items;
    };
    const planDetails = expand
        ? [
              {
                  title: 'Department',
                  width: 200,
                  textAlign: 'left'
              },
              {
                  title: 'Section',
                  width: 150,
                  textAlign: 'center'
              },
              {
                  title: 'Team',
                  width: 200,
                  textAlign: 'right'
              },
              {
                  title: 'House Type',
                  width: 200,
                  textAlign: 'left'
              },
              {
                  title: 'Henkou Type',
                  width: 250,
                  textAlign: 'center'
              },
              {
                  title: 'Status',
                  width: 200,
                  textAlign: 'right'
              }
          ]
        : [];
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    return (
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
                        addonBefore="Customer Code"
                        style={{ width: 300, margin: '0 0' }}></Search>
                </Col>
                <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                    <RangePicker
                        defaultValue={[
                            moment('2015/01/01', dateFormat),
                            moment('2015/01/01', dateFormat)
                        ]}
                        format={dateFormat}
                    />
                </Col>

                {/* {planDetails.map((item, index) => (
                    <Col style={{ textAlign: item.textAlign }} span={8} key={index}>
                        <Form.Item
                            style={{ marginBottom: '0px' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Input something!'
                                }
                            ]}>
                            <Input addonBefore={item.title} style={{ width: item.width }} />
                        </Form.Item>
                    </Col>
                ))} */}

                {FilterSelections()}
            </Row>
            <Row>
                <Col span={8}>
                    <Button type="primary" htmlType="submit">
                        Upload
                    </Button>
                </Col>
                <Col span={16} style={{ textAlign: 'right' }}>
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

export default FilterContainer;
