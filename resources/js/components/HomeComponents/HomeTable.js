import React from 'react';
import { Table } from 'antd';
const HomeTable = () => {
	// const columns = [
	//     {
	//         title: 'Full Name',
	//         width: 100,
	//         dataIndex: 'name',
	//         key: 'name',
	//         fixed: 'left'
	//     },
	//     {
	//         title: 'Age',
	//         width: 100,
	//         dataIndex: 'age',
	//         key: 'age',
	//         fixed: 'left'
	//     },
	//     { title: 'Column 1', dataIndex: 'address', key: '1' },
	//     { title: 'Column 2', dataIndex: 'address', key: '2' },
	//     { title: 'Column 3', dataIndex: 'address', key: '3' },
	//     { title: 'Column 4', dataIndex: 'address', key: '4' },
	//     { title: 'Column 5', dataIndex: 'address', key: '5' },
	//     { title: 'Column 6', dataIndex: 'address', key: '6' },
	//     { title: 'Column 7', dataIndex: 'address', key: '7' },
	//     { title: 'Column 8', dataIndex: 'address', key: '8' },
	//     {
	//         title: 'Action',
	//         key: 'operation',
	//         fixed: 'right',
	//         width: 100,
	//         render: () => <a>action</a>
	//     }
	// ];

	return (
		<Table
			style={{ marginTop: 10 }}
			columns={headers}
			bordered
			dataSource={data}
			scroll={{ x: 'max-content' }}
		/>
	);
};

export default HomeTable;
