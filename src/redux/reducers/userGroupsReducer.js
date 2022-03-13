const initState = {
    asOwner: [],
    asMember: []
}

export const userGroupsReducer = (state=initState, action) => {
    switch (action.type){
        case "USER_GROUPS/SET":
            return action.payload    
        default:
            return state
    }
  }