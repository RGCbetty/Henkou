import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import Base from '../Base';

const AdminRoute = ({ component: Component, access_level, isAuthenticated, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated && access_level == 1 ? (
				<Component {...props} {...rest} />
			) : (
				<Redirect
					to={{
						pathname: '/login'
						// state: { from: props.location }
					}}
				/>
			)
		}></Route>
);

AdminRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	access_level: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	access_level: state.auth.user.access_level
});

export default connect(mapStateToProps)(AdminRoute);
