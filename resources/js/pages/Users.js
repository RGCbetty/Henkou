import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

const Users = () => {
	return <div>Manage Users</div>;
};
const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});
export default connect(mapStateToProps)(Users);
