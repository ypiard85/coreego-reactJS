import {isAuthenticated} from './authReducer';
import {combineReducers} from 'redux';

export const allReducers = combineReducers({
    authReducer: isAuthenticated
})
