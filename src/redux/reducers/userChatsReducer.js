export const userChatsReducer = (state=[], action) => {
    switch (action.type){
        case "USER_CHATS/SET":
            return action.payload    
        default:
            return state
    }
  }