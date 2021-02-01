import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            // <Base>
            <Component {...props} />
            // </Base>
        )}
    />
);

PublicRoute.propTypes = {};

export default PublicRoute;
