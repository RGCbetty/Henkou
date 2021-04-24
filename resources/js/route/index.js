import React from 'react';
import { Switch, BrowserRouter as Router, useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import routes from './routes';
import PrivateRoute from './Private';
import PublicRoute from './Public';
import SplitRoute from './Split';
import AdminRoute from './Admin';
import Base from '../Base';
const Routes = ({ isAuthenticated }) => (
	<Router>
		{isAuthenticated ? (
			<Base>
				<Switch>
					{routes.map((route) => {
						if (route.auth && route.fallback) {
							// return <PublicRoute key={route.path} {...route} />;
							return <SplitRoute key={route.path} {...route} />;
						}
						if (route.auth && route.admin) {
							// return <PublicRoute key={route.path} {...route} />;
							return <AdminRoute key={route.path} {...route} />;
						}
						if (route.auth) {
							// return <PublicRoute key={route.path} {...route} />;
							return <PrivateRoute key={route.path} {...route} />;
						}

						return <PublicRoute key={route.path} {...route} />;
					})}
				</Switch>
			</Base>
		) : (
			<Switch>
				{routes.map((route) => {
					if (route.auth && route.fallback) {
						// return <PublicRoute key={route.path} {...route} />;
						return <SplitRoute key={route.path} {...route} />;
					}
					if (route.auth) {
						// return <PublicRoute key={route.path} {...route} />;
						return <PrivateRoute key={route.path} {...route} />;
					}

					return <PublicRoute key={route.path} {...route} />;
				})}
			</Switch>
		)}
	</Router>
);
Routes.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Routes);

// export default Routes;
