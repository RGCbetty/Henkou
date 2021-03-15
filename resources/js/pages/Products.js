import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';
import { useProductsRetriever } from '../api/products';
import {
	useMasterCompany,
	useMasterSuppliers,
	useMasterDepartment,
	useMasterSection,
	useMasterTeam
} from '../api/master';
import Highlighter from 'react-highlight-words';
import productHeaders from '../components/ProductsComponents/ManageProductsHeaders';
import { Table, Input, Button, Space, Form, Modal, Transfer, Tag, Switch } from 'antd';
import difference from 'lodash/difference';
import { SearchOutlined, UpOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Popconfirm, Typography } from 'antd';
const Products = () => {
	const [form] = Form.useForm();
	const inputRef = useRef();
	const [departments, setDepartments] = useMasterDepartment();
	const [sections, setSections] = useMasterSection();
	const [teams, setTeams] = useMasterTeam();
	const [company, setCompany] = useMasterCompany();
	const [masterProducts, setMasterProducts] = useProductsRetriever();
	const [allSupplier, setAllSupplier] = useMasterSuppliers();
	const [suppliers, setSuppliers] = useState([]);
	const [state, setState] = useState({
		searchedColumn: '',
		searchText: ''
	});
	const [modal, setModal] = useState({
		title: '',
		title_key: '',
		visible: false
	});
	const [transfer, setTransfer] = useState({
		targetKeys: [],
		disabled: false,
		showSearch: true
	});
	const { targetKeys, disabled, showSearch } = transfer;
	const [editingKey, setEditingKey] = useState('');
	const isEditing = (record) => record.key === editingKey;
	const getColumnSearchProps = (dataIndex, title) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={inputRef}
					placeholder={`Search ${title}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setState({
								searchText: selectedKeys[0],
								searchedColumn: dataIndex
							});
						}}>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => inputRef.current, 100);
			}
		},
		render: (text) =>
			state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[state.searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			)
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex
		});
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setState({ searchText: '' });
	};
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
	const openModal = async (record) => {
		const supplierKeys = await Http.get(`api/supplier`, { params: record });
		setSuppliers(supplierKeys.data);
		const matchedSuppliers = supplierKeys.data.map((item) => {
			return product.data.length > 0
				? product.data
						.map((el) => {
							if (el.product_key == item.supplier_key) {
								if (el) return { ...el, last_touch: item.last_touch };
							}
						})
						.filter((attr) => attr !== undefined)
				: null;
		});

		const merge = matchedSuppliers.flat(1);
		const products = merge.map((item) => item.id);
		// const allProducts = await Http.get('api/products');
		// const reduceByKey = _.uniqBy(allProducts.data, (obj) => obj.product_key);
		// console.log(reduceByKey);
		// const allProducts = await Http.get('api/products');
		// const reduceByKey = _.uniqBy(allProducts.data, (obj) => obj.product_key);
		// console.log(reduceByKey);
		// setProduct({ ...product, data: reduceByKey });
		// setProduct({ ...product, data: uniqueProd });
		setTransfer({ ...transfer, targetKeys: products });
		setModal({ title: record.product_name, title_key: record.product_key, visible: true });
	};
	const mergedColumns = productHeaders(
		getColumnSearchProps,
		save,
		cancel,
		edit,
		isEditing,
		editingKey,
		openModal
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
	/* TRANSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER  */

	const handleLastTouch = (text, row, index) => {
		// const supplier = [...record];
		uniqueProducts[
			uniqueProducts.findIndex((element) => element.product_key == row.product_key)
		].last_touch = !row.last_touch;
		// const products = product.data;

		const clonedProducts = [...uniqueProducts];
		setProduct({ ...product, data: clonedProducts });
	};

	const leftTableColumns = [
		{
			title: 'Department',
			dataIndex: 'department',
			width: 170,
			align: 'center'
		},

		{
			title: 'Product',
			width: 200,
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		}
	];
	const rightTableColumns = [
		{
			title: 'Department',
			dataIndex: 'department',
			width: 120,
			align: 'center'
		},
		{
			title: 'Product',
			width: 200,
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		},
		{
			title: 'Main',
			width: 120,
			dataIndex: 'last_touch',
			render: (text, row, index) => {
				return (
					<Switch
						disabled={
							product.data.some(
								(item) => targetKeys.includes(item.id) && item.last_touch == true
							) && !text
						}
						checked={text}
						unCheckedChildren="No"
						checkedChildren="Yes"
						onChange={() => handleLastTouch(text, row, index)}
					/>
				);
			},
			align: 'center'
		}
	];

	const onChange = (nextTargetKeys) => {
		setTransfer({ ...transfer, targetKeys: nextTargetKeys });
	};

	const triggerDisable = (disabled) => {
		setTransfer({ ...transfer, disabled: !disabled });
	};

	const triggerShowSearch = (showSearch) => {
		setTransfer({ ...transfer, showSearch: !showSearch });
	};

	const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
		<Transfer {...restProps} showSelectAll={false}>
			{({
				direction,
				filteredItems,
				onItemSelectAll,
				onItemSelect,
				selectedKeys: listSelectedKeys,
				disabled: listDisabled
			}) => {
				const columns = direction === 'left' ? leftColumns : rightColumns;

				const rowSelection = {
					getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
					onSelectAll(selected, selectedRows) {
						const treeSelectedKeys = selectedRows
							.filter((item) => !item.disabled)
							.map(({ key }) => key);
						const diffKeys = selected
							? difference(treeSelectedKeys, listSelectedKeys)
							: difference(listSelectedKeys, treeSelectedKeys);
						onItemSelectAll(diffKeys, selected);
					},
					onSelect({ key }, selected) {
						onItemSelect(key, selected);
					},
					selectedRowKeys: listSelectedKeys
				};

				return (
					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={filteredItems}
						size="small"
						scroll={{ x: 'max-content', y: 'calc(100vh - 25em)' }}
						// scroll={{ y: 'calc(100vh - 10em)' }}
						style={{ pointerEvents: listDisabled ? 'none' : null }}
						onRow={({ key, disabled: itemDisabled }) => ({
							onClick: () => {
								if (itemDisabled || listDisabled) return;
								onItemSelect(key, !listSelectedKeys.includes(key));
							}
						})}
					/>
				);
			}}
		</Transfer>
	);
	const [product, setProduct] = useProductsRetriever();
	const uniqueProducts = _.uniqBy(product.data, (obj) => obj.product_key);

	const modalOk = async () => {
		const productsToUpdate = product.data
			.map((el) => {
				return { last_touch: false, ...el };
			})
			.filter((item) => targetKeys.includes(item.id));
		const update = await Http.post('/api/productcategories', {
			product_key: modal.title_key,
			products: productsToUpdate
		});
		// const allProducts = await Http.get('api/products');
		// const reduceByKey = _.uniqBy(allProducts.data, (obj) => obj.product_key);
		// console.log(reduceByKey);
		// setMasterProducts(product.data);
		// setAllSupplier(allSupplier);
		// setProduct({ ...product });
		setModal({ modal: false });
	};
	const modalCancel = async () => {
		const allProducts = await Http.get('api/products');
		const reduceByKey = _.uniqBy(allProducts.data, (obj) => obj.product_key);
		setProduct({ ...product, data: reduceByKey });
		setModal({ modal: false });
	};
	return (
		<>
			<div style={{ margin: 5 }}>
				<Form form={form} component={false}>
					<Table
						components={{
							body: {
								cell: EditableCell
							}
						}}
						scroll={{ x: 'max-content', y: 'calc(100vh - 24em)' }}
						rowClassName="editable-row"
						bordered
						loading={product.loading}
						columns={mergedColumns}
						dataSource={uniqueProducts.map((item, index) => {
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
												return attr.DepartmentCode == item.department_id;
										  })
											? departments.find((attr) => {
													return (
														attr.DepartmentCode == item.department_id
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
													return attr.SectionCode == item.section_id;
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
								count:
									allSupplier.length > 0
										? allSupplier.filter(
												(el) => el.product_key == item.product_key
										  ).length
										: null,

								main_supplier:
									allSupplier.length > 0
										? allSupplier.filter(
												(el) => el.product_key == item.product_key
										  ).length > 0
											? allSupplier
													.filter(
														(el) => el.product_key == item.product_key
													)
													.find((attr) => attr.last_touch)
												? masterProducts.data.find((el) => {
														return (
															el.product_key ==
															allSupplier
																.filter(
																	(el) =>
																		el.product_key ==
																		item.product_key
																)
																.find((attr) => attr.last_touch)
																.supplier_key
														);
												  }).product_name
												: null
											: null
										: null,

								last_touch:
									suppliers.length > 0
										? suppliers.find((attr) => {
												return attr.supplier_key == item.product_key;
										  })
											? suppliers.find((attr) => {
													return attr.supplier_key == item.product_key;
											  }).last_touch
											: false
										: false,
								// count: supplierKeys.length,
								...item
							};
						})}
						pagination={{
							showTotal: () => `Total ${uniqueProducts.length} items`,
							onChange: cancel
						}}
					/>
				</Form>
			</div>
			<Modal
				title={`${modal.title}`}
				centered
				visible={modal.visible}
				onOk={() => modalOk()}
				onCancel={() => modalCancel()}
				width={1000}>
				<div style={{ overflowY: 'scroll', height: 'calc(100vh - 12em)' }}>
					<TableTransfer
						titles={['Product Categories', 'Suppliers']}
						dataSource={uniqueProducts.map((item, index) => {
							return {
								key: item.id,
								department:
									departments.length > 0
										? departments.find((attr) => {
												return attr.DepartmentCode == item.department_id;
										  })
											? departments.find((attr) => {
													return (
														attr.DepartmentCode == item.department_id
													);
											  }).DepartmentName
											: null
										: null,
								last_touch:
									suppliers.length > 0
										? suppliers.find((attr) => {
												return attr.supplier_key == item.product_key;
										  })
											? suppliers.find((attr) => {
													return attr.supplier_key == item.product_key;
											  }).last_touch
											: false
										: false,
								...item
							};
						})}
						targetKeys={targetKeys}
						disabled={disabled}
						showSearch={showSearch}
						onChange={onChange}
						filterOption={(inputValue, item) => {
							return (
								item.department.toLowerCase().indexOf(inputValue.toLowerCase()) !==
									-1 ||
								item.product_name
									.toLowerCase()
									.indexOf(inputValue.toLowerCase()) !== -1
							);
						}}
						leftColumns={leftTableColumns}
						rightColumns={rightTableColumns}
					/>
				</div>
				{/* <Switch
					unCheckedChildren="disabled"
					checkedChildren="disabled"
					checked={disabled}
					onChange={() => triggerDisable(disabled)}
					style={{ marginTop: 16 }}
				/> */}
				{/* <Switch
					unCheckedChildren="showSearch"
					checkedChildren="showSearch"
					checked={showSearch}
					onChange={() => triggerShowSearch(showSearch)}
					style={{ marginTop: 16 }}
				/> */}
			</Modal>
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Products);
