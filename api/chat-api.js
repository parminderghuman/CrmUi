import AppUrl from "./apps";

export const ChatSave = (token, id,eClass, data) => {

    return fetch(AppUrl.AppUrl + 'comment/'+id+"/"+eClass, {
      method: "post", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      }, body: JSON.stringify(data)
    });
  }
  export const FetchChat = (token, id,eClass, params) => {
    var url = new URL(AppUrl.AppUrl + 'comment/'+id+"/"+eClass);
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
  export default {
    FetchChat,
    ChatSave,
   
  };
  