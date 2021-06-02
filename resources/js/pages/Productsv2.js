import React, { useEffect, useState, useRef } from 'react';
import { Table, Input, Form, Select, Tag, Skeleton, BackTop, Button, Modal, Transfer } from 'antd';
import { connect } from 'react-redux';
import { useMasterState } from '../api/products';
import withSearch from '../utils/withSearch.jsx';
import qs from 'qs';
import ManageProductsColumns from '../components/ProductsComponents/ManageProductsColumns';
import DraggableTable from '../components/ProductsComponents/DraggableTable';
import Http from '../Http';
const { Option } = Select;

const Products = ({ title, getColumnSearchProps, props }) => {
	const { user } = props;
	const [form] = Form.useForm();

	const [modal, setModal] = useState({
		visible: false,
		title: 'Add Product',
		toEditProductKey: '',
		visiblePopConfirm: false,
		toDeleteProductKey: ''
	});
	const { toEditProductKey, visiblePopConfirm, toDeleteProductKey } = modal;
	const [state, setState] = useMasterState(user);
	const {
		toSoftDelete,
		toUpsert,
		products,
		affectedProducts,
		loading,
		selectedPlanStatus,
		planstatus,
		designations,
		departments,
		sections,
		teams
	} = state;
	const [transfer, setTransfer] = useState({
		targetKeys: [],
		disabled: false,
		showSearch: true
	});
	console.log(products, 'prorororororo');
	const { targetKeys, disabled, showSearch } = transfer;
	useEffect(() => {
		document.title = title || '';
	}, [title]);

	const onChangePlanStatus = async (value) => {
		setState((prevState) => ({
			...prevState,
			loading: true
		}));
		if (value !== 0) {
			const planStatusID = value;
			const { data: process } = await Http.get(`/api/products/planstatus/${planStatusID}`);
			console.log(process);
			setState((prevState) => {
				return {
					...prevState,
					loading: false,
					affectedProducts: process.sort((a, b) => a.sequence_no - b.sequence_no),
					selectedPlanStatus: value
				};
			});
		} else {
			const { data: products } = await Http.get(`/api/master/products`);
			setState((prevState) => {
				return {
					...prevState,
					loading: false,
					affectedProducts: products,
					selectedPlanStatus: value
				};
			});
		}
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
						className={'affected-products'}
						// scroll={{ x: 'max-content', y: 'calc(100vh - 25em)' }}
						// scroll={{ y: 'calc(100vh - 25em)' }}
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
	const handleModal = () => {
		// form.resetFields();
		form.setFieldsValue({
			product: '',
			departments: user.DepartmentCode,
			sections: [user.SectionCode],
			teams: [user.TeamCode]
		});
		setModal({
			...modal,
			visible: true,
			title: 'Add Product'
		});
		handleDesignation();
		// setState((prevState) => ({
		// 	...prevState,
		// 	selectedDepartments: user.DepartmentCode,
		// 	selectedSections: [user.SectionCode],
		// 	selectedTeams: [user.TeamCode]
		// }));
		setTransfer((prevState) => ({
			...prevState,
			targetKeys: affectedProducts.map((obj) => obj.product_key)
		}));
	};
	const modalCancel = () => {
		setState((prevState) => ({ ...prevState, toUpsert: [], toSoftDelete: [] }));
		setModal({
			...modal,
			visible: false,
			product_key: ''
		});
	};
	const onCreateProductCategory = async (values) => {
		setModal((prevState) => ({ ...prevState, visible: false }));
		const toUpsert = { ...values, product_key: toEditProductKey };
		const { data, status } = await Http.post(
			'http://localhost:3000/api/henkou/master/product',
			toUpsert
		);
		if (status == 200) {
			setState((prevState) => ({ ...prevState, products: data }));
		}
	};
	const modalOk = async () => {
		console.log(toSoftDelete);
		// setState((prevState) => ({
		// 	...prevState,
		// 	selectedDepartments: user.DepartmentCode,
		// 	selectedSections: [user.SectionCode],
		// 	selectedTeams: [user.TeamCode]
		// }));
		if (selectedPlanStatus !== 0 && toSoftDelete.length > 0) {
			const { status } = await Http.post(
				`/api/henkou/master/process/product/softdelete`,
				toSoftDelete
			);
			console.info(status);
			// if (status == 200) {
			// 	setState((prevState) => ({
			// 		...prevState,
			// 		affectedProducts: data.sort((a, b) => a.sequence_no - b.sequence_no)
			// 	}));
			// }
		}
		if (selectedPlanStatus !== 0 && toUpsert.length > 0) {
			const { data, status } = await Http.post(
				`/api/henkou/master/process/${selectedPlanStatus}`,
				toUpsert
			);
			if (status == 200) {
				setState((prevState) => ({
					...prevState,
					affectedProducts: data.sort((a, b) => a.sequence_no - b.sequence_no),
					toSoftDelete: [],
					toInsert: []
				}));
			}
		}
		// form.submit();
		if (selectedPlanStatus == 0) {
			form.validateFields()
				.then((values) => {
					form.resetFields();
					onCreateProductCategory(values);
				})
				.catch((info) => {
					console.log('Validate Failed:', info);
				});
		} else {
			setModal((prevState) => ({ ...prevState, visible: false }));
		}
		// setModal({
		// 	...modal,
		// 	visible: false
		// });
	};
	const handleTransferOnChange = (nextTargetKeys) => {
		const newAffectedProducts = nextTargetKeys.filter(
			(key) => affectedProducts.findIndex((obj) => obj.product_key == key) == -1
		);
		const softDeleteProducts = affectedProducts.filter(
			(item) => nextTargetKeys.indexOf(item.product_key) == -1
		);

		if (softDeleteProducts.length > 0) {
			setState((prevState) => ({ ...prevState, toSoftDelete: softDeleteProducts }));
		}
		// affectedProducts[
		// 	affectedProducts.findIndex((item) => !nextTargetKeys.includes(item.product_key))
		// ].deleted_at = moment()
		// 	.utc()
		// 	.local()
		// 	.format('YYYY-MM-DD HH:mm:ss');
		// console.log(affectedProducts);
		const toInsert = newAffectedProducts.map((item) => ({
			id: null,
			product_key: item,
			plan_status_id: selectedPlanStatus,
			deleted_at: null,
			updated_by: user.EmployeeCode
		}));

		const mergeWithExisting = [
			...toInsert,
			...affectedProducts.filter(
				(item) =>
					softDeleteProducts.findIndex((obj) => obj.product_key == item.product_key) == -1
			)
		].map(({ product_category, ...item }, index) => ({
			...item,
			sequence_no: index + 1
		}));
		console.log(mergeWithExisting);

		// products.filter(
		// 	(item) => nextTargetKeys.indexOf(item.product_key) >= 0
		// );

		setState((prevState) => ({ ...prevState, toUpsert: mergeWithExisting }));
		setTransfer({ ...transfer, targetKeys: nextTargetKeys });
	};
	const handleSelectOnChange = async (title) => {
		switch (title) {
			case 'departments':
				form.setFieldsValue({
					sections: [],
					teams: []
				});
				// const { data: Sections } = await Http.get(
				// 	'http://localhost:3000/api/department/{dep_id}/sections',
				// 	{
				// 		params: { dep_id: form.getFieldValue('departments') }
				// 	}
				// );
				setState((prevState) => {
					return {
						...prevState,
						sections: _.uniqBy(
							designations
								.filter(
									(item) =>
										item.DepartmentCode == form.getFieldValue('departments')
								)
								.map((item) => item.sections),
							'SectionCode'
						),
						loading: false
					};
				});
				break;
			case 'sections':
				form.setFieldsValue({
					teams: []
				});
				// const { data: Teams } = await Http.get(
				// 	'http://localhost:3000/api/department/{dep_id}/sections/teams',
				// 	{
				// 		params: {
				// 			dep_id: form.getFieldValue('departments'),
				// 			sec_id: form.getFieldValue('sections')
				// 		},
				// 		paramsSerializer: (params) => {
				// 			return qs.stringify(params, { arrayFormat: 'brackets' });
				// 		}
				// 	}
				// );

				setState((prevState) => {
					return {
						...prevState,
						teams: _.uniqBy(
							designations
								.filter(
									(item) =>
										item.DepartmentCode == form.getFieldValue('departments') &&
										form.getFieldValue('sections').includes(item.SectionCode)
								)
								.map((item) => item.teams),
							'TeamCode'
						),
						loading: false
					};
				});
				break;
		}
		// console.log(value);
	};
	const leftTableColumns = [
		{
			title: 'Product',
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		},
		{
			title: 'Department',
			align: 'center',
			dataIndex: 'designations',
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
		}
		// {
		// 	title: 'Section',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: 'designations',
		// 	render: (designations) => (
		// 		<>
		// 			{[
		// 				...new Map(
		// 					designations
		// 						.map(({ section }) => ({
		// 							id: section.SectionCode,
		// 							name: section.SectionName
		// 						}))
		// 						.map((item) => [item['id'], item])
		// 				).values()
		// 			].map((section) => (
		// 				<Tag color="blue" key={section.id}>
		// 					{section.name}
		// 				</Tag>
		// 			))}
		// 		</>
		// 	),
		// 	key: '7'
		// },
		// {
		// 	title: 'Team',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: 'designations',
		// 	render: (designations) => (
		// 		<>
		// 			{[
		// 				...new Map(
		// 					designations
		// 						.map(({ team }) => ({
		// 							id: team.TeamCode,
		// 							name: team.TeamName
		// 						}))
		// 						.map((item) => [item['id'], item])
		// 				).values()
		// 			].map((team) => (
		// 				<Tag color="blue" key={team.id}>
		// 					{team.name}
		// 				</Tag>
		// 			))}
		// 		</>
		// 	),
		// 	key: '8'
		// }
	];
	const rightTableColumns = [
		{
			title: 'Product',
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		},
		{
			title: 'Department',
			align: 'center',
			dataIndex: 'designations',
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
		}
		// {
		// 	title: 'Section',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: 'designations',
		// 	render: (designations) => (
		// 		<>
		// 			{[
		// 				...new Map(
		// 					designations
		// 						.map(({ section }) => ({
		// 							id: section.SectionCode,
		// 							name: section.SectionName
		// 						}))
		// 						.map((item) => [item['id'], item])
		// 				).values()
		// 			].map((section) => (
		// 				<Tag color="blue" key={section.id}>
		// 					{section.name}
		// 				</Tag>
		// 			))}
		// 		</>
		// 	),
		// 	key: '7'
		// },
		// {
		// 	title: 'Team',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: 'designations',
		// 	render: (designations) => (
		// 		<>
		// 			{[
		// 				...new Map(
		// 					designations
		// 						.map(({ team }) => ({
		// 							id: team.TeamCode,
		// 							name: team.TeamName
		// 						}))
		// 						.map((item) => [item['id'], item])
		// 				).values()
		// 			].map((team) => (
		// 				<Tag color="blue" key={team.id}>
		// 					{team.name}
		// 				</Tag>
		// 			))}
		// 		</>
		// 	),
		// 	key: '8'
		// }
	];
	const handleOnClickSave = async () => {
		const { data, status } = await Http.post(
			`/api/henkou/master/process/${selectedPlanStatus}`,
			affectedProducts.map(({ product_category, ...item }, index) => ({
				...item,
				sequence_no: index + 1
			}))
		);
		if (status == 200) {
			setState((prevState) => ({
				...prevState,
				affectedProducts: data.sort((a, b) => a.sequence_no - b.sequence_no)
			}));
		}
		// setState((prevState) => ({
		// 	...prevState,
		// 	affectedProducts: affectedProducts.sort((a, b) => a.sequence_no - b.sequence_no)
		// }));
		// console.log(status);
	};
	const handleDesignation = () => {
		setState((prevState) => {
			return {
				...prevState,
				sections: _.uniqBy(
					designations
						.filter((item) => item.DepartmentCode == form.getFieldValue('departments'))
						.map((item) => item.sections),
					'SectionCode'
				),
				teams: _.uniqBy(
					designations
						.filter(
							(item) =>
								item.DepartmentCode == form.getFieldValue('departments') &&
								form.getFieldValue('sections').includes(item.SectionCode)
						)
						.map((item) => item.teams),
					'TeamCode'
				)
			};
		});
	};
	const handleEditProduct = async (row) => {
		form.setFieldsValue({
			product: row.product_name,
			departments: [
				...new Map(
					row.designations
						.map(({ department }) => ({
							id: department?.DepartmentCode,
							name: department?.DepartmentName
						}))
						.map((item) => [item['id'], item])
				).values()
			]

				.map(({ id }) => id)
				.filter((item) => item)

				.toString(),
			sections: [
				...new Map(
					row.designations
						.map(({ section }) => ({
							id: section?.SectionCode,
							name: section?.SectionName
						}))
						.map((item) => [item['id'], item])
				).values()
			]
				.map(({ id }) => id)
				.filter((item) => item),

			teams: [
				...new Map(
					row.designations
						.map(({ team }) => ({
							id: team?.TeamCode,
							name: team?.TeamName
						}))
						.map((item) => [item['id'], item])
				).values()
			]
				.map(({ id }) => id)
				.filter((item) => item)
		});
		handleDesignation();
		setModal((prevState) => ({
			...prevState,
			visible: true,
			title: `Edit ${row.product_name}`,
			toEditProductKey: row.product_key
		}));
		console.log(sections);
		// setState((prevState) => ({
		//     ...prevState,
		//     sections: sections.filter(item => item.)
		// }))

		// const { data: Sections } = await Http.get(
		// 	'http://localhost:3000/api/department/{dep_id}/sections',
		// 	{
		// 		params: { dep_id: form.getFieldValue('departments') }
		// 	}
		// );
		// const { data: Teams } = await Http.get(
		// 	'http://localhost:3000/api/department/{dep_id}/sections/teams',
		// 	{
		// 		params: {
		// 			dep_id: form.getFieldValue('departments'),
		// 			sec_id: form.getFieldValue('sections')
		// 		},
		// 		paramsSerializer: (params) => {
		// 			return qs.stringify(params, { arrayFormat: 'brackets' });
		// 		}
		// 	}
		// );
		// setState((prevState) => {
		// 	return {
		// 		...prevState,
		// 		sections: Sections,
		// 		teams: Teams,
		// 		loading: false
		// 	};
		// });
	};
	const handleDeleteProduct = (row) => {
		setModal((prevState) => ({
			...prevState,
			visiblePopConfirm: true,
			toDeleteProductKey: row.product_key
		}));
	};
	const isDeleting = (row) => row.product_key == toDeleteProductKey;
	const onPopConfirmOk = async (row) => {
		const { data } = await Http.put(
			`http://localhost:3000/api/henkou/master/product/${row.product_key}`
		);
		console.log(data);
		setState((prevState) => ({ ...prevState, products: data }));
		setModal((prevState) => ({
			...prevState,
			visiblePopConfirm: false,
			toDeleteProductKey: ''
		}));
	};
	const onPopConfirmCancel = () => {
		setModal((prevState) => ({
			...prevState,
			visiblePopConfirm: false,
			toDeleteProductKey: ''
		}));
	};
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<h1 className="title-page">Product Lists</h1>
				<div>
					<Button type="primary" onClick={() => handleModal()}>
						Add Product
					</Button>
					{selectedPlanStatus !== 0 && (
						<Button
							type="primary"
							style={{ marginLeft: '10px' }}
							onClick={handleOnClickSave}>
							Save
						</Button>
					)}
					<Select
						style={{ margin: '10px 30px 0px 10px', width: '250px' }}
						defaultValue="All"
						onChange={onChangePlanStatus}>
						{[{ id: 0, plan_status_name: 'All' }, ...planstatus].map((item) => {
							return (
								<Option key={item.id} value={item.id}>
									{item.plan_status_name}
								</Option>
							);
						})}
					</Select>
				</div>
			</div>

			{selectedPlanStatus == 0 ? (
				<Form form={form} component={false}>
					<Table
						style={{ margin: 10 }}
						scroll={{ x: 'max-content', y: 'calc(100vh - 24em)' }}
						bordered
						columns={ManageProductsColumns(
							getColumnSearchProps,
							{
								handleEditProduct,
								handleDeleteProduct,
								onPopConfirmOk,
								onPopConfirmCancel
							},
							visiblePopConfirm,
							isDeleting
						)}
						loading={loading}
						// locale={{
						// 	emptyText: loading ? <Skeleton active={true} /> : <Empty />
						// }}
						rowKey={(record) => record.product_key}
						dataSource={products.length <= 0 ? [] : products}
						pagination={{
							showTotal: () => `Total ${products.length} items`
						}}
					/>
				</Form>
			) : (
				<DraggableTable
					loading={loading}
					props={{ affectedProducts, setState }}></DraggableTable>
			)}
			<BackTop visibilityHeight={200}></BackTop>
			<Modal
				className="recheck-modal"
				title={modal.title}
				width={selectedPlanStatus == 0 ? 600 : 1500}
				visible={modal.visible}
				onOk={() => modalOk()}
				okButtonProps={{
					disabled: selectedPlanStatus !== 0 ? toUpsert.length == 0 : false
				}}
				onCancel={() => modalCancel()}>
				<div>
					{selectedPlanStatus !== 0 ? (
						<TableTransfer
							rowKey={(record) => record.product_key}
							titles={[
								'Product Categories',
								planstatus.find((obj) => obj.id == selectedPlanStatus)
									.plan_status_name
							]}
							dataSource={products}
							targetKeys={targetKeys}
							disabled={disabled}
							showSearch={showSearch}
							onChange={handleTransferOnChange}
							filterOption={(inputValue, item) => {
								return (
									// item.designations.findIndex(
									// 	(item) =>
									// 		item.department.DepartmentName.toLowerCase() ==
									// 		inputValue.toLowerCase()
									// ) !== -1 ||
									item.product_name
										.toLowerCase()
										.indexOf(inputValue.toLowerCase()) !== -1
								);
							}}
							leftColumns={leftTableColumns}
							rightColumns={rightTableColumns}
						/>
					) : (
						<Form
							form={form}
							layout="vertical"
							name="product_categories"
							initialValues={{
								departments: user.DepartmentCode,
								sections: [user.SectionCode],
								teams: [user.TeamCode]
							}}>
							<Form.Item
								shouldUpdate
								name="product"
								label="Product Name"
								rules={[
									{
										required: true,
										message: 'Please input name of the product!'
									}
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								rules={[
									{
										required: true,
										message: 'Please select department!'
									}
								]}
								shouldUpdate
								name="departments"
								label="Department">
								<Select
									style={{
										width: '100%'
									}}
									options={departments.map((item) => ({
										label: item.DepartmentName,
										value: item.DepartmentCode
									}))}
									onChange={() => {
										handleSelectOnChange('departments');
										// setState((prevState) => ({
										// 	...prevState,
										// 	selectedDepartments: newValue
										// }));
									}}
									placeholder="Select Item..."
									maxTagCount="responsive"
								/>
							</Form.Item>
							<Form.Item
								rules={[
									{
										required: true,
										message: 'Please select section/s'
									}
								]}
								shouldUpdate
								name="sections"
								label="Section/s">
								<Select
									mode="multiple"
									style={{
										width: '100%'
									}}
									options={sections.map((item) => ({
										label: item.SectionName,
										value: item.SectionCode
									}))}
									onChange={() => {
										handleSelectOnChange('sections');
										// setState((prevState) => ({
										// 	...prevState,
										// 	selectedSections: newValue
										// }));
									}}
									placeholder="Select Item..."
									maxTagCount="responsive"
								/>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: 0 }}
								rules={[
									{
										required: true,
										message: 'Please select team/s'
									}
								]}
								shouldUpdate
								name="teams"
								label="Team/s">
								<Select
									mode="multiple"
									style={{
										width: '100%'
									}}
									options={teams.map((item) => ({
										label: item.TeamName,
										value: item.TeamCode
									}))}
									// onChange={(newValue) => {
									// 	setState((prevState) => ({
									// 		...prevState,
									// 		selectedTeams: newValue
									// 	}));
									// }}
									placeholder="Select Item..."
									maxTagCount="responsive"
								/>
							</Form.Item>
							{/* <Form.Item name="departments" label="Department/s">
								<Select {...selectProps} />
							</Form.Item>
							<Form.Item name="departments" label="Department/s">
								<Select {...selectProps} />
							</Form.Item> */}
						</Form>
					)}
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
	user: state.auth.user
});

export default connect(mapStateToProps)(withSearch(Products));
