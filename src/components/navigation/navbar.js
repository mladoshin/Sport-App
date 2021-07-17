import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { useTheme } from '@material-ui/core/styles';


// Import a navbar for mobile devices
import MobileNavbar from "./mobileNavbar";

// Import a navbar for desktop devices
import DesktopNavbar from "./desktopNavbar"

//menu items for coach app
const coachMenu = [
  {title: "Home", path: ""},
  {title: "Dashboard", path: "/dashboard"},
  {title: "Messages", path: "/chats"},
  {title: "Training Groups", path: "/training-groups"},
  {title: "Workout builder", path: "/workouts"},
  {title: "Notes", path: "/notes"},
  {title: "Calendar", path: "/calendar"}
]

//menu items for admin app
const adminMenu = [
  {title: "Home", path: ""},
  {title: "Dashboard", path: "/dashboard"},
  {title: "Statistics", path: "/statistics"},
  {title: "Search", path: "/search"}
]

//menu items for sportsman app
const sportsmanMenu = [
  {title: "Home", path: ""},
  {title: "Dashboard", path: "/dashboard"},
  {title: "Messages", path: "/chats"},
  {title: "Workouts", path: "/workouts"},
  {title: "Training groups", path: "/training-groups"},
  {title: "Diary", path: "/diary"},
  {title: "Goals", path: "/goals"},
  {title: "ToDos", path: "/todos"},
  {title: "Calendar", path: "/calendar"},
  {title: "Notes", path: "/notes"},
  {title: "Workout builder", path: "/workouts"},
]

function NavBar(props) {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([])
  const [open, setOpen] = useState(false);

  //setting the menu items according to the user's role
  useEffect(()=>{
    if(props.user.claims){
      if(props.user.claims.role == "ADMIN"){
        setMenuItems(adminMenu)
      }else if(props.user.claims.role == "COACH"){
        setMenuItems(coachMenu)
      }else if(props.user.claims.role == "SPORTSMAN"){
        setMenuItems(sportsmanMenu)
      }
    }
    
  }, [props.user.claims])


  // if the device is mobile, then render a mobile navbar, else render a desktop version of a navbar
  if (props.mobile){
    return <MobileNavbar open={open} setOpen={setOpen} user={props.user} menuItems={menuItems}>{props.children}</MobileNavbar>
  }else{
    return <DesktopNavbar open={open} setOpen={setOpen} user={props.user} menuItems={menuItems}>{props.children}</DesktopNavbar>
  }
  
}


const mapStateToProps = state => {
  return {
    user: state.user,
    theme: state.theme,
    mobile: state.isTouchable
  }
}

const mapDispatchToProps = dispatch => {
  return {
    removeUserInfo: () => { dispatch({ type: "USER/LOADINFO", payload: { id: null, auth: false } }) },
    setTheme: (str) => dispatch({ type: "THEME/CHANGE", payload: str })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));