import React from 'react';
import { Table } from 'antd';
const HenkouTable = (props) => {
	const { headers, data, loading } = props;
	return (
		<Table
			style={{ marginTop: 10 }}
			columns={headers}
			loading={loading}
			bordered
			rowKey={(record) => record.id}
			dataSource={data}
			scroll={{ x: 'max-content', y: 'calc(100vh - 23em)' }}
		/>
	);
};

export default HenkouTable;
