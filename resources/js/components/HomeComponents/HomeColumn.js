import React from 'react';
import { Tag, Button, Popconfirm, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const HomeColumn = (save, cancel, edit, isEditing, editingKey) => [
	{
		title: 'Registration Date',
		width: 145,
		align: 'center',
		dataIndex: 'created_at',
		key: '1',
		fixed: 'left'
	},
	{
		title: 'Received Date',
		width: 140,
		align: 'center',
		dataIndex: 'received_date',
		key: '2',
		fixed: 'left'
	},
	{
		title: 'Customer Code',
		width: 100,
		align: 'center',
		key: '3',
		dataIndex: 'customer_code',
		fixed: 'left'
	},
	{
		title: 'Process/Product',
		width: 180,
		align: 'center',
		key: '4',
		dataIndex: 'product_name'
	},
	{
		title: 'Plan Status',
		width: 160,
		align: 'center',
		key: '5',
		dataIndex: 'plan_status'
	},
	{
		title: 'Department',
		width: 120,
		align: 'center',
		dataIndex: ['affected_product', 'product_category', 'designations'],
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ department }) => ({
								id: department.DepartmentCode,
								name: department.DepartmentName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((department) => (
					<Tag color="blue" key={department.id}>
						{department.name}
					</Tag>
				))}
			</>
		),
		key: '6'
	},
	{
		title: 'Section',
		width: 120,
		align: 'center',
		dataIndex: ['affected_product', 'product_category', 'designations'],
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ section }) => ({
								id: section.SectionCode,
								name: section.SectionName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((section) => (
					<Tag color="blue" key={section.id}>
						{section.name}
					</Tag>
				))}
			</>
		),
		key: '7'
	},
	{
		title: 'Team',
		width: 120,
		align: 'center',
		dataIndex: ['affected_product', 'product_category', 'designations'],
		render: (designations) => (
			<>
				{[
					...new Map(
						designations
							.map(({ team }) => ({
								id: team.TeamCode,
								name: team.TeamName
							}))
							.map((item) => [item['id'], item])
					).values()
				].map((team) => (
					<Tag color="blue" key={team.id}>
						{team.name}
					</Tag>
				))}
			</>
		),
		key: '8'
	},

	{
		title: 'House Code',
		width: 80,
		align: 'center',
		key: '9',
		dataIndex: 'house_code'
	},
	{
		title: 'House Type',
		width: 100,
		align: 'center',
		key: '10',
		dataIndex: 'house_type'
	},
	{
		title: 'Henkou Type',
		width: 100,
		align: 'center',
		key: '11',
		dataIndex: 'henkou_type'
	},
	{
		title: 'TH Number',
		width: 50,
		align: 'center',
		key: '12',
		dataIndex: 'th_no',
		render: (text) => (text ? text : '-')
	},
	{
		title: 'Plan Number',
		width: 80,
		align: 'center',
		key: '13',
		dataIndex: 'plan_no'
	},
	{
		title: 'Revision No',
		width: 80,
		align: 'center',
		key: '14',
		dataIndex: 'rev_no'
	},
	{
		title: 'Henkou Reason',
		width: 100,
		align: 'center',
		key: '15',
		dataIndex: 'henkou_reason'
	},
	{
		title: 'Henkou Details',
		width: 100,
		align: 'center',
		key: '16',
		dataIndex: 'log'
	},

	{
		title: 'Joutou Date',
		width: 140,
		align: 'center',
		key: '17',
		dataIndex: 'construction_schedule',
		render: (text) => (text.joutou_date ? text.joutou_date : '-')
	},
	{
		title: 'Days before Joutou',
		width: 140,
		align: 'center',
		key: '18',
		dataIndex: 'construction_schedule',
		render: (text) => (text.days_before_joutou ? text.days_before_joutou : '-')
	},
	{
		title: 'Kiso Start Date',
		width: 140,
		align: 'center',
		key: '19',
		dataIndex: 'construction_schedule',
		render: (text) => (text.kiso_start ? text.kiso_start : '-')
	},
	{
		title: 'Days before Kiso Start',
		width: 140,
		align: 'center',
		key: '20',
		dataIndex: 'construction_schedule',
		render: (text) => (text.days_before_kiso_start ? text.days_before_kiso_start : '-')
	},
	{
		title: 'Henkou Start Date',
		width: 140,
		align: 'center',
		key: '21',
		dataIndex: 'start_date'
	},
	{
		title: 'Henkou Finish Date',
		width: 140,
		align: 'center',
		key: '22',
		dataIndex: 'finished_date',
		render: (text) => (text ? text : '-')
	},
	{
		title: 'Days in Process',
		width: 100,
		align: 'center',
		key: '23',
		dataIndex: 'days_in_process',
		render: (text) => (text ? text : '-')
	},
	{
		title: 'Pending Reason',
		width: 100,
		align: 'center',
		key: '24',
		dataIndex: 'pending_reason'
	}
];

export default HomeColumn;
