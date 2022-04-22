import {isAuthenticated} from './authReducer';
import {profil} from './profilReducer';
import {combineReducers} from 'redux';


export const allReducers = combineReducers({
    authReducer: isAuthenticated,
    profilReducer: profil
})
