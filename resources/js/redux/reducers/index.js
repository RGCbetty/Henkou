import { combineReducers } from 'redux';
import auth from './auth';
import productCategories from './PCMSproductCategories';
import persistStore from './persistStore';

const rootReducer = combineReducers({ auth, productCategories, persistStore });

export default rootReducer;
