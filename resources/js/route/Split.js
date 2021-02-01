import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
// import Base from '../Base';

const SplitRoute = ({ component: Component, fallback: Fallback, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated ? (
                <Component {...props} {...rest} />
            ) : (
                // <Base>
                <Fallback {...props} />
                // </Base>
            )
        }
    />
);

SplitRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(SplitRoute);
