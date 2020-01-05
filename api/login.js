import AppUrl from "./apps";
export const loginUser =(email,password) =>{
    return fetch(AppUrl.AppUrl+"login" ,{method: "post", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },body: JSON.stringify({username: email,password:password})});
}

export default {
    loginUser,
  };
  