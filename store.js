import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/combile-reducer';

const middlewares = [ReduxThunk];

const store = createStore(
     rootReducer,
    {},// default state of the application
    compose(applyMiddleware(...middlewares)),
);


export default store;