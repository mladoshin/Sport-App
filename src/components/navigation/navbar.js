import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { AppBar, Toolbar, Drawer, Typography, Button, IconButton, CssBaseline, List, ListItem, Divider, ListItemIcon, ListItemText } from '@material-ui/core';
//import MenuIcon from '@material-ui/icons/Menu';

//import MUIDrawer from './drawer'
//import NotificationMenu from "../notifications/notificationMenu"
//import ProfileModalWindow from '../profile/profileModalWindow'
//import AccountMenu from './accountMenu'
//import AccountToolbar from './accountToolbar'


import clsx from 'clsx';

//icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MobileNavbar from "./mobileNavbar";
import MiniDrawer from "./desktopNavbar"

//menu items for coach app
const coachMenu = [
  {title: "Home", path: ""},
  {title: "Dashboard", path: "/dashboard"},
  {title: "Messages", path: "/messages"},
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
  {title: "Workouts", path: "/workouts"},
  {title: "Diary", path: "/diary"},
  {title: "Goals", path: "/goals"},
  {title: "ToDos", path: "/todos"}
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

  //console.log(menuItems)

  //console.log(props.mobile)

  if (props.mobile){
    return <MobileNavbar open={open} setOpen={setOpen} user={props.user} menuItems={menuItems}>{props.children}</MobileNavbar>
  }else{
    return <MiniDrawer open={open} setOpen={setOpen} user={props.user} menuItems={menuItems}>{props.children}</MiniDrawer>
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
    setTheme: (str) => dispatch({ type: "THEME/CHANGE", payload: str }),
    //clearGoalsState: () => dispatch({ type: "GOALS/LOAD", payload: {} }),
    //clearCategoriesState: () => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: [] }),
    //clearAvatar: ()=>dispatch({ type: "AVATAR/LOAD", payload: "" }),
    //clearNotifications: ()=>dispatch({ type: "NOTIFICATION/LOAD", payload: [] })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));