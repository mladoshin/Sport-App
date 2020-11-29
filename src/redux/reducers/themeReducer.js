export const themeReducer = (state="light", action) => {
    switch (action.type){
      case "THEME/CHANGE":
        return action.payload
      default:
        return state
    }
  }