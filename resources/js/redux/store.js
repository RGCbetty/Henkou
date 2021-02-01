import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// const devtools =
//     process.env.NODE_ENV === 'test'
//         ? x => x /* eslint-disable no-underscore-dangle */
//         : window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
/* eslint-enable no-underscore-dangle */
// const middlewares = compose(applyMiddleware(thunk, logger), devtools);
const middlewares = compose(applyMiddleware(thunk, logger));

export default createStore(rootReducer, middlewares);
