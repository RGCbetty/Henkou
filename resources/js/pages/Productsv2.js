import React, { useEffect, useState } from 'react';
import { Table, Input, Form, Skeleton, Empty } from 'antd';
import { connect } from 'react-redux';
import { useProductsRetriever } from '../api/products';
import { useMasterDepartment, useMasterSection, useMasterTeam } from '../api/master';
import ManageProductsColumns from '../components/ProductsComponents/ManageProductsColumns';
const Products = ({ title, ...rest }) => {
	const [form] = Form.useForm();
	const [departments, setDepartments] = useMasterDepartment();
	const [sections, setSections] = useMasterSection();
	const [teams, setTeams] = useMasterTeam();
	const [products, setProducts] = useProductsRetriever();
	const [editingKey, setEditingKey] = useState('');
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
	const mergedColumns = ManageProductsColumns(save, cancel, edit, isEditing, editingKey).map(
		(col) => {
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
		}
	);
	return (
		<>
			<h1 className="title-page">Product Lists</h1>
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
					// loading={products.loading}
					columns={mergedColumns}
					locale={{
						emptyText: products.loading ? <Skeleton active={true} /> : <Empty />
					}}
					dataSource={
						products.loading
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
											departments.length > 0
												? departments.find((attr) => {
														return (
															attr.DepartmentCode ==
															item.department_id
														);
												  })
													? departments.find((attr) => {
															return (
																attr.DepartmentCode ==
																item.department_id
															);
													  }).DepartmentName
													: null
												: null,
										section:
											sections.length > 0
												? sections.find((attr) => {
														return attr.SectionCode == item.section_id;
												  })
													? sections.find((attr) => {
															return (
																attr.SectionCode == item.section_id
															);
													  }).SectionName
													: null
												: null,
										team:
											teams.length > 0
												? teams.find((attr) => {
														return attr.TeamCode == item.team_id;
												  })
													? teams.find((attr) => {
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
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Products);
