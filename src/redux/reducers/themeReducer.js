const initState = {
  colorMode: "light",
  contentShift: 0
}
export const themeReducer = (state=initState, action) => {
    switch (action.type){
      case "THEME/CHANGE":
        console.log("Changing the theme to "+action.payload)
        return {...state, colorMode: action.payload}
      case "THEME/CONTENT_SHIFT":
        let st1 = state
        st1.contentShift = action.payload
        return st1
      default:
        return state
    }
  }