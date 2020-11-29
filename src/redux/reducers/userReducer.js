export const userReducer = (state={id: null, auth: false}, action) => {
    switch (action.type){
      case "USER/LOADINFO":
        return action.payload
      default:
        return state
    }
  }