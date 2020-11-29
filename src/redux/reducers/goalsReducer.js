export const goalsReducer = (state=[], action) => {
    switch (action.type){
      case "GOALS/LOAD":
        return action.payload
      default:
        return state
    }
  }