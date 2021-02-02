export const isTouchableReducer = (state=false, action) => {
    console.log(action.payload)
    switch (action.type){
      case "ISTOUCHABLE/SET":
        
        return action.payload
        
      default:
        return state
    }
  }