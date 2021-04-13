import { combineReducers } from 'redux';
import auth from './auth';
import masterLists from './master';
import persistStore from './persistStore';

const rootReducer = combineReducers({ auth, masterLists, persistStore });

export default rootReducer;
