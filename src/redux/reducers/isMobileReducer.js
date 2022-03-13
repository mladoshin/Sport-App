export const isMobileReducer = (state=false, action) => {
    switch (action.type){
      case "ISMOBILE/SET":
        return action.payload
        
      default:
        return state
    }
  }