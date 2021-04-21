export const userPreferencesReducer = (state={appTheme: "light"}, action) => {
    switch (action.type){
      case "USER/LOAD-PREFERENCES":
        if(!action.payload){
          return state
        }
        return action.payload
      case "USER/UPDATE-APPTHEME":
        return {...state, appTheme: action.payload }
      default:
        return state
    }
  }