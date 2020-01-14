import AppUrl from "./apps";
export const loginUser =(email,password) =>{
    return fetch(AppUrl.AppUrl+"login" ,{method: "post", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },body: JSON.stringify({username: email,password:password})});
}
export const FetchLoginUser = (token) => {
  return fetch(AppUrl.AppUrl
    +"me",{method: "get", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization':token
    }});
}
export default {
    loginUser,FetchLoginUser
  };
  