import React from 'react';
import withFetch from '../../utils/withFetch';
import { Table, Form, Select } from 'antd';
import header from './PlanstatusHeader';
const { Option } = Select;
class Planstatus extends React.Component {
	constructor(props) {
		super(props);
	}
	// static getDerivedStateFromProps(props){
	//     console.log(props)
	//     return null
	// }
	// componentDidMount() {}

	render() {
		const { data } = this.props;
		return (
			<>
				<h1 className="title-page">Plan Status</h1>
				<div style={{ margin: '10px' }}>
					<Table
						bordered
						columns={header()}
						rowKey={(row) => row.id}
						dataSource={data}></Table>
				</div>
			</>
		);
	}
}

export default withFetch(Planstatus, '/api/master/planstatuses');
