import React, { useEffect, useState } from 'react';
import { Table, Input, Form, Select, Tag, Skeleton, BackTop, Button, Modal, Transfer } from 'antd';
import { connect } from 'react-redux';
import { useMasterState } from '../api/products';
import withSearch from '../utils/withSearch.jsx';
import ManageProductsColumns from '../components/ProductsComponents/ManageProductsColumns';
import DraggableTable from '../components/ProductsComponents/DraggableTable';
import Http from '../Http';
const { Option } = Select;
const Products = ({ title, getColumnSearchProps, props }) => {
	const { user } = props;
	const [form] = Form.useForm();
	const [modal, setModal] = useState({
		visible: false,
		title: 'Add Product'
	});
	const [state, setState] = useMasterState(user);
	const {
		products,
		affectedProducts,
		loading,
		selectedPlanStatus,
		planstatus,
		departments,
		sections,
		teams,
		selectedDepartments,
		selectedSections,
		selectedTeams
	} = state;
	const [transfer, setTransfer] = useState({
		targetKeys: [],
		disabled: false,
		showSearch: true
	});
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
			const { data: process } = await Http.get(`/api/products/planstatus/${value}`);
			setState((prevState) => {
				return {
					...prevState,
					loading: false,
					affectedProducts: process.map(({ product, ...item }) => {
						return { ...product, ...item };
					}),
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
	const handleModal = () => {
		setModal({
			...modal,
			visible: true
		});
		setTransfer((prevState) => ({
			...prevState,
			targetKeys: affectedProducts.map((obj) => obj.product_key)
		}));
	};
	const modalCancel = () => {
		setModal({
			...modal,
			visible: false
		});
	};
	const modalOk = () => {
		form.validateFields()
			.then((values) => {
				form.resetFields();
				onCreate(values);
			})
			.catch((info) => {
				console.log('Validate Failed:', info);
			});
		setModal({
			...modal,
			visible: false
		});
	};
	const handleTransferOnChange = (nextTargetKeys) => {
		setTransfer({ ...transfer, targetKeys: nextTargetKeys });
	};
	const leftTableColumns = [
		{
			title: 'Product',
			width: 200,
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		},
		{
			title: 'Department',
			width: 120,
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
			width: 200,
			dataIndex: 'product_name',
			key: 'product_name',
			align: 'center'
		},
		{
			title: 'Department',
			width: 120,
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
	console.log(targetKeys);
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<h1 className="title-page">Product Lists</h1>
				<div>
					<Button type="primary" onClick={() => handleModal()}>
						Add Product
					</Button>
					{selectedPlanStatus !== 0 && (
						<Button type="primary" style={{ marginLeft: '10px' }}>
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
						columns={ManageProductsColumns(getColumnSearchProps)}
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
							name="form_in_modal"
							initialValues={{
								departments: selectedDepartments,
								sections: selectedSections,
								teams: selectedTeams
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
										message: 'Please input name of the product!'
									}
								]}
								shouldUpdate
								name="departments"
								label="Department/s">
								<Select
									mode="multiple"
									style={{
										width: '100%'
									}}
									options={departments.map((item) => ({
										label: item.DepartmentName,
										value: item.DepartmentCode
									}))}
									onChange={(newValue) => {
										setState((prevState) => ({
											...prevState,
											selectedDepartments: newValue
										}));
									}}
									placeholder="Select Item..."
									maxTagCount="responsive"
								/>
							</Form.Item>
							<Form.Item
								rules={[
									{
										required: true,
										message: 'Please input name of the product!'
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
									onChange={(newValue) => {
										setState((prevState) => ({
											...prevState,
											selectedSections: newValue
										}));
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
										message: 'Please input name of the product!'
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
									onChange={(newValue) => {
										setState((prevState) => ({
											...prevState,
											selectedTeams: newValue
										}));
									}}
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
