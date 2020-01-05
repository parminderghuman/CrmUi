import { AsyncStorage } from 'react-native';
import API from "../api/entity-save";
import { apisAreAvailable } from 'expo';

export const saveEntity = (name, data) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.EntitySave(token, name, data)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        dispatch({ type: "Load", data: null });
                        dispatch({ type: "Load", data: json });
                    });

                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    };
}
export const clearEntity = () => {
    return  function (dispatch, getState) {
        dispatch({ type: "Load", data: null });
    };
}
export const saveSystemEntity = (name, data) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.EntitySave(token, name, data)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        dispatch({ type: "SystemEntity", data: json });
                    });

                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    };
}


export const fetchEntities = (name) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.FetchEntities(token, name)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        dispatch({ type: "List", data: json });
                    });

                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    };
}
export const fetchRoles = (name) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.FetchEntities(token, name)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        dispatch({ type: "Roles", data: json });
                    });

                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    };
}

export const fetchSystemEntities = (name) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.FetchEntities(token, name)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        dispatch({ type: "SystemEntityList", data: json });
                    });

                } else {
                    dispatch(loading(false));
                    dispatch(error(true));
                }

            })
            .catch(error => console.log(error))
    };
}

export const fetchEntity = (name, id) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.FetchEntity(token, name, id)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {
                        var a = getState();

                        dispatch({ type: "Load", data: json });
                    });

                } else {

                }

            })
            .catch(error => console.log(error))
    };
}

export const fetchSystemEntity = (name, id) => {
    return async function (dispatch, getState) {

        const token = await AsyncStorage.getItem('userToken')

        await API.FetchEntity(token, name, id)

            .then((responseJson) => {
                if (responseJson.status == 200) {
                    responseJson.json().then(json => {

                        var a = getState();
                        a.entityReducer.systemEntityMap[id] = json;
                        dispatch({ type: "SystemEntityMap", data: { map: a.entityReducer.systemEntityMap, entity: json } });
                        // dispatch({type:"SystemEntity",data:json});
                    });

                } else {

                }

            })
            .catch(error => console.log(error))
    };
} 