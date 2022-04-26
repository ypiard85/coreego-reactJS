import {isAuthenticated} from './authReducer';
import {hasProfil} from './profilReducer';
import {combineReducers} from 'redux';


export const allReducers = combineReducers({
    authReducer: isAuthenticated,
    profilReducer: hasProfil
})
