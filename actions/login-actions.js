import { AsyncStorage } from 'react-native';
import API from "../api/login";

export const getToken = (token) => ({
    type: 'GET_TOKEN',
    token,
});

export const saveToken = token => ({
    type: 'SAVE_TOKEN',
    token
});

export const removeToken = () => ({
    type: 'REMOVE_TOKEN',
});

export const loading = bool => ({
    type: 'LOADING',
    isLoading: bool,
});

export const error = error => ({
    type: 'ERROR',
    error,
});
export const authetication = token => ({
    type: 'AUTHENTICATED',
    token,
});



export const getUserToken = () => dispatch =>

    AsyncStorage.getItem('userToken')
        .then((data) => {
            dispatch(loading(false));
            dispatch(getToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })



export const saveUserToken = (data) => dispatch =>
    AsyncStorage.setItem('userToken', 'abc')
        .then((data) => {
            dispatch(loading(false));
            dispatch(saveToken('token saved'));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })

export const removeUserToken = () => dispatch =>
    AsyncStorage.removeItem('userToken')
        .then((data) => {
            dispatch(loading(false));
            dispatch(removeToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })

export const loginUser = (email, password) => {
    return async function (dispatch, getState) {
        dispatch(error(false));
        API.loginUser(email, password)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    AsyncStorage.setItem('userToken', responseJson.headers.map["authorization"]).then((data) => {
                        dispatch(loading(false));
                        dispatch(authetication(responseJson.headers.map["authorization"]));
                    })
                        .catch((err) => {
                            dispatch(loading(false));
                            dispatch(error(true));
                        })
                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    }
}       