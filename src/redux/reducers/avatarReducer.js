export const avatarReducer = (state="", action) => {
    switch (action.type){
      case "AVATAR/LOAD":
        return action.payload
      default:
        return state
    }
  }