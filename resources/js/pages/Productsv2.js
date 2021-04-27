import React, { useEffect, useState } from 'react';
import { Table, Input, Form, Select, Empty, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { useProductsRetriever } from '../api/products';
import withSearch from '../utils/withSearch.jsx';
import ManageProductsColumns from '../components/ProductsComponents/ManageProductsColumns';
const { Option } = Select;
const Products = ({ props, ...rest }) => {
	const { getColumnSearchProps } = rest;
	const { title, master } = props;
	const [form] = Form.useForm();
	// const [master.departments, setmaster.departments] = useMasterDepartment();
	// const [master.sections, setmaster.sections] = useMasterSection();
	// const [master.teams, setmaster.teams] = useMasterTeam();
	const [products, setProducts] = useProductsRetriever();
	console.log(products);
	const [editingKey, setEditingKey] = useState('');
	// console.log(products);
	const isEditing = (record) => record.key === editingKey;
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...product];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				setProduct({ data: newData });
				setEditingKey('');
			} else {
				newData.push(row);
				setProduct({ data: newData });
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const cancel = () => {
		setEditingKey('');
	};

	const edit = (record) => {
		form.setFieldsValue({
			department: '',
			product_name: '',
			...record
		});
		setEditingKey(record.key);
	};
	const EditableCell = ({
		editing,
		dataIndex,
		title,
		inputType,
		record,
		index,
		children,
		...restProps
	}) => {
		const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item
						name={dataIndex}
						style={{
							margin: 0
						}}
						rules={[
							{
								required: true,
								message: `Please Input ${title}!`
							}
						]}>
						{inputNode}
					</Form.Item>
				) : (
					children
				)}
			</td>
		);
	};
	const mergedColumns = ManageProductsColumns(
		getColumnSearchProps,
		save,
		cancel,
		edit,
		isEditing,
		editingKey
	).map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === 'age' ? 'number' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record)
			})
		};
	});

	return (
		<>
			<h1 className="title-page">Product Lists</h1>
			<Select
				style={{ float: 'right', margin: '10px 30px 20px 0px', width: '200px' }}
				defaultValue="jack">
				<Option value="jack">All</Option>
				<Option value="ngi">E-PLAN PROCESS</Option>
				<Option value="lucy">KOUZOU FINISHED-WAKU</Option>
				<Option value="jones">ONE TIME HENKOU</Option>
				<Option value="tom">KOUZOU FINISHED-JIKU</Option>
			</Select>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell
						}
					}}
					style={{ margin: 10 }}
					scroll={{ x: 'max-content', y: 'calc(100vh - 24em)' }}
					rowClassName="editable-row"
					bordered
					columns={mergedColumns}
					locale={{
						emptyText: products.loading ? <Skeleton active={true} /> : <Empty />
					}}
					dataSource={
						products.data.length <= 0
							? []
							: products.data.map((item, index) => {
									// console.log(item);
									// let supplierKeys;
									// Http.get(`api/supplier`, { params: item }).then(
									// 	(res) => (res.data = supplierKeys)
									// );
									// console.log(supplierKeys);
									// const getProductKey =
									// 	allSupplier.length > 0
									// 		? allSupplier
									// 				.filter((el) => el.product_key == item.product_key)
									// 				.map((attr) => attr.product_key)
									// 		: null;
									return {
										key: item.id,
										department:
											master.departments.length > 0
												? master.departments.find((attr) => {
														return (
															attr.DepartmentCode ==
															item.department_id
														);
												  })
													? master.departments.find((attr) => {
															return (
																attr.DepartmentCode ==
																item.department_id
															);
													  }).DepartmentName
													: null
												: null,
										section:
											master.sections.length > 0
												? master.sections.find((attr) => {
														return attr.SectionCode == item.section_id;
												  })
													? master.sections.find((attr) => {
															return (
																attr.SectionCode == item.section_id
															);
													  }).SectionName
													: null
												: null,
										team:
											master.teams.length > 0
												? master.teams.find((attr) => {
														return attr.TeamCode == item.team_id;
												  })
													? master.teams.find((attr) => {
															return attr.TeamCode == item.team_id;
													  }).TeamName
													: null
												: null,

										...item
									};
							  })
					}
					pagination={{
						showTotal: () => `Total ${products.data.length} items`
					}}
				/>
			</Form>
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo,
	master: state.auth.master
});
export default connect(mapStateToProps)(withSearch(Products));
