import { AsyncStorage } from 'react-native';
import AppUrl from "./apps";

export const EntitySave = (token, name, data) => {

  return fetch(AppUrl.AppUrl + name, {
    method: "post", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }, body: JSON.stringify(data)
  });
}
export const FetchEntities = (token, name, params) => {
  var url = new URL(AppUrl.AppUrl
    + name);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  }
  return fetch(url, {
    method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }
  });
}

export const FetchEntity = (token, name, data) => {

  return fetch(AppUrl.AppUrl
    + name + "/" + data, {
    method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }
  });
}



export const FetchUserEntity = (token) => {
  return fetch(AppUrl.AppUrl
    + "system_tables/user", {
    method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }
  });
}

export const FetchSystemEntity = (token,id) => {
  return fetch(AppUrl.AppUrl
    + "system_tables/"+id, {
    method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }
  });
}

export const FetchSystemPermission = (token,id) => {
  return fetch(AppUrl.AppUrl
    + "System_Table_Permissions/"+id, {
    method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }
  });
}
export const SaveFetchSystemPermission = (token,id,data) => {
  return fetch(AppUrl.AppUrl
    + "System_Table_Permissions/"+id, {
    method: "post", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }, body: JSON.stringify(data)
  });
}
export const updatePassword = (token, data) => {
  return fetch(AppUrl.AppUrl
    + "/users/reset-password", {
    method: "post", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }, body: JSON.stringify(data)

  });
}
export const startNewChat = (token, data) => {
  return fetch(AppUrl.AppUrl
    + "System_Chats/" + data, {
    method: "post", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    }

  });
}


export default {
  EntitySave,
  FetchEntities,
  FetchEntity,
  FetchUserEntity,
  updatePassword,
   startNewChat,
   FetchSystemEntity,
   SaveFetchSystemPermission,
   FetchSystemPermission
};
