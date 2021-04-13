import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { authCheck } from './redux/actions/auth';
import { setMaster } from './api/master';
import store from './redux/store';
import Routes from './route';
import * as serviceWorker from './serviceWorker';
// store.dispatch(setMaster());
store.dispatch(authCheck());
ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	document.getElementById('root')
);
serviceWorker.unregister();
