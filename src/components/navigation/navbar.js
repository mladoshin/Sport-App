import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { useTheme } from '@material-ui/core/styles';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';

import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import ContactSupportRoundedIcon from '@material-ui/icons/ContactSupportRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
// Import a navbar for mobile devices
import MobileNavbar from "./mobile/mobileNavbar"

// Import a navbar for desktop devices
import DesktopNavbar from "./desktop/desktopNavbar"

//menu items for coach app
const userMenu = [
  {title: "Home", path: "/home", icon: HomeRoundedIcon},
  {title: "Messages", path: "/chats", icon: ChatBubbleRoundedIcon},
  {title: "Training Groups", path: "/training-groups", icon: GroupRoundedIcon},
  {title: "Calendar", path: "/calendar", icon: CalendarTodayRoundedIcon}
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
  {title: "Messages", path: "/chats"},
  {title: "Training groups", path: "/training-groups"},
  {title: "Calendar", path: "/calendar"},

]

const homeMenuItems = [
  {title: "Home", path: "/", icon: HomeRoundedIcon},
  {title: "About Us", path: "/aboutUs", icon: InfoRoundedIcon},
  {title: "Contacts", path: "/contacts", icon: ContactSupportRoundedIcon},
  {title: "Login", path: "/login", icon: PersonRoundedIcon},
]

function NavBar(props) {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([])
  const [open, setOpen] = useState(false);

  //setting the menu items according to the user's role
  useEffect(()=>{
    
    if(props.user?.uid){
      setMenuItems(userMenu)
    }else{
      setMenuItems(homeMenuItems)
    }
    
  }, [props.user])


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
    mobile: state.isMobile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    removeUserInfo: () => { dispatch({ type: "USER/LOADINFO", payload: { id: null, auth: false } }) },
    setTheme: (str) => dispatch({ type: "THEME/CHANGE", payload: str })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));