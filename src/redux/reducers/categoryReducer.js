export const categoryReducer = (state={}, action) => {
    switch (action.type){
      case "GOALS/CATEGORY/LOAD":
        return action.payload
      default:
        return state
    }
  }