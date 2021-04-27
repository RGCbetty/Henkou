import React from 'react';
import Highlighter from 'react-highlight-words';

/* Component */
/* Material Design */
import { Input, Space, Button } from 'antd';

/* API */
import { SearchOutlined } from '@ant-design/icons';
const withSearch = (WrappedComponent) => {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.inputRef = React.createRef();
			this.state = {
				searchedColumn: '',
				searchText: ''
			};
		}
		getColumnSearchProps = (dataIndex, title) => ({
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						ref={this.inputRef}
						placeholder={`Search ${title}`}
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
					<Space>
						<Button
							type="primary"
							onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
							icon={<SearchOutlined />}
							size="small"
							style={{ width: 90 }}>
							Search
						</Button>
						<Button
							onClick={() => this.handleReset(clearFilters)}
							size="small"
							style={{ width: 90 }}>
							Reset
						</Button>
						<Button
							type="link"
							size="small"
							onClick={() => {
								confirm({ closeDropdown: false });
								this.setState({
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
					setTimeout(() => this.inputRef.current, 100);
				}
			},
			render: (text) =>
				this.state.searchedColumn === dataIndex ? (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[this.state.searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					/>
				) : (
					text
				)
		});

		handleSearch = async (selectedKeys, confirm, dataIndex) => {
			confirm();
			this.setState({
				searchText: selectedKeys[0],
				searchedColumn: dataIndex
			});
		};
		handleReset = async (clearFilters) => {
			clearFilters();
			this.setState({
				searchText: '',
				searchedColumn: ''
			});
		};
		render() {
			return <WrappedComponent {...this} />;
		}
	};
};

export default withSearch;
