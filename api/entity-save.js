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
export default {
  EntitySave,
  FetchEntities,
  FetchEntity, FetchUserEntity
};
