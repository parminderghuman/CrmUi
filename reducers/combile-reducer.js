import { combineReducers } from 'redux';
import rootReducer from './login-reducer'
import entityReducer from './entity-reducer'

export default combineReducers({
    loginReducer: rootReducer,
    entityReducer:entityReducer
});
