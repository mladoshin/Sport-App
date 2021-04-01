export const isTouchableReducer = (state=false, action) => {
    switch (action.type){
      case "ISTOUCHABLE/SET":
        return action.payload
        
      default:
        return state
    }
  }