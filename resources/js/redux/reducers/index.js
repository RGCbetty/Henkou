import { combineReducers } from 'redux';
import auth from './auth';
import persistStore from './persistStore';

const rootReducer = combineReducers({ auth, persistStore });

export default rootReducer;
