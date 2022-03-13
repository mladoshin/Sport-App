export const userGroupChatsReducer = (state=[], action) => {
    switch (action.type){
        case "USER_GROUP_CHATS/SET":
            return action.payload    
        default:
            return state
    }
  }