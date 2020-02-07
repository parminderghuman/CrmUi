import AppUrl from "./apps";

export const ChatSave = (token, id, data) => {

    return fetch(AppUrl.AppUrl + 'System_Messages/'+id, {
      method: "post", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      }, body: JSON.stringify(data)
    });
  }
  export const FetchMessage = (token, id, params) => {
    var url = new URL(AppUrl.AppUrl + 'System_Messages/'+id);
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
    export const FetchMessageByEntity = (token, id, params) => {
    var url = new URL(AppUrl.AppUrl + 'System_Messages/Entity/'+id);
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
  export const FetchChat = (token, id, params) => {
    var url = new URL(AppUrl.AppUrl + 'System_Chats/'+id);
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
  export const FetchChatbyEntity = (token, entityId,entityClass, params) => {
    var url = new URL(AppUrl.AppUrl + 'System_Chats/Entity/'+entityId+"/"+entityClass);
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
   export const FetchChatList = (token,  params) => {
    var url = new URL(AppUrl.AppUrl + 'System_Chats');
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
    FetchChatList,
    FetchMessage,
    FetchChatbyEntity,
    FetchMessageByEntity
  };
  