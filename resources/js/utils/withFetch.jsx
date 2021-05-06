import React from 'react';
import Http from '../Http';
import { Spin } from 'antd';
const withFetch = (WrappedComponent, requestUrl) => {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				loading: true,
				data: []
			};
		}
		componentDidMount() {
			this.mounted = true;
			if (requestUrl) {
				this.fetchData(requestUrl);
			}
		}
		componentWillUnmount() {
			this.mounted = false;
		}
		fetchData = async (url) => {
			// this.setState({ ...this.state, data: [] });
			try {
				const response = await Http.get(url);
				if (this.mounted) {
					this.setState((prevState) => {
						return {
							...prevState,
							loading: false,
							data: response.data
						};
					});
				}
			} catch (error) {
				console.error(error);
			}
		};
		render() {
			return (
				<Spin spinning={this.state.loading}>
					<WrappedComponent {...this.state} {...this.props} />
				</Spin>
			);
		}
	};
};

export default withFetch;
