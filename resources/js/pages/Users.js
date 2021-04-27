import React, { useContext, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Select, Button, Popconfirm, Form, Input } from 'antd';
import { ManageUserColumns } from '../components/SettingsComponents/ManageUserSettings';
import { useUsersRetriever } from '../api/users';
const EditableContext = React.createContext(null);
import Http from '../Http';
const { Option } = Select;

const Users = ({ title, ...rest }) => {
	const [users, SetUsers] = useUsersRetriever();
	const { data, pagination, loading } = users;
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const confirm = (user) => {
		user.is_registered = 1;
		Http.post('/api/user/verify', user).then((res) => console.warn(res));
		users.data[users.data.findIndex((item) => item.id == user.id)] = user;
		const [...usersClone] = users.data;
		SetUsers({
			...users,
			data: usersClone
		});
	};
	const handleSave = (row) => {
		const newData = [...users.data];
		const index = newData.findIndex((item) => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, { ...item, ...row });
		SetUsers({
			...users,
			data: newData
		});
		Http.post('/api/user/role', row).then((res) => console.warn(res));
	};
	const columns = ManageUserColumns(confirm).map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave
			})
		};
	});
	const handleDelete = (key) => {
		const dataSource = [...this.state.dataSource];
		this.setState({
			dataSource: dataSource.filter((item) => item.key !== key)
		});
	};
	const handleAdd = () => {
		const { count, dataSource } = this.state;
		const newData = {
			key: count,
			name: `Edward King ${count}`,
			age: '32',
			address: `London, Park Lane no. ${count}`
		};
		this.setState({
			dataSource: [...dataSource, newData],
			count: count + 1
		});
	};

	const EditableRow = ({ index, ...props }) => {
		const [form] = Form.useForm();
		return (
			<Form form={form} component={false}>
				<EditableContext.Provider value={form}>
					<tr {...props} />
				</EditableContext.Provider>
			</Form>
		);
	};

	const EditableCell = ({
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef(null);
		const form = useContext(EditableContext);
		useEffect(() => {
			if (editing) {
				inputRef.current.focus();
			}
		}, [editing]);

		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({
				[dataIndex]: record[dataIndex]
			});
		};

		const save = async () => {
			try {
				const values = await form.validateFields();
				// console.log(record);
				toggleEdit();
				handleSave({ ...record, ...values });
			} catch (errInfo) {
				console.log('Save failed:', errInfo);
			}
		};

		let childNode = children;

		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{
						margin: 0
					}}
					name={dataIndex}
					rules={[
						{
							required: true,
							message: `${title} is required.`
						}
					]}>
					<Select ref={inputRef} onChange={save} onBlur={toggleEdit}>
						<Option value="Administrator">Administrator</Option>
						<Option value="Viewer">Viewer</Option>
						<Option value="Encoder">Encoder</Option>
					</Select>
					{/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
				</Form.Item>
			) : (
				<div
					className="editable-cell-value-wrap"
					style={{
						paddingRight: 24
					}}
					onClick={toggleEdit}>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	};
	const handleTableChange = (page, filters, sorter) => {
		SetUsers({
			...users,
			pagination: {
				...page,
				showTotal: (total) => `Total ${total} items`
			}
		});
	};
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell
		}
	};
	return (
		<>
			{/* <div className="manage_users" /> */}
			<h1 className="title-page">Manage Users</h1>
			<Spin spinning={loading}>
				<Table
					rowKey={(record) => record.id}
					style={{ margin: 10 }}
					components={components}
					rowClassName={() => 'editable-row'}
					columns={columns}
					dataSource={data}
					pagination={pagination}
					onChange={handleTableChange}
					bordered></Table>
			</Spin>
		</>
	);
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Users);
