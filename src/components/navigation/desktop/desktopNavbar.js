// <---------- Navbar for desktop devices---------->

import React, { Suspense } from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline, Drawer, AppBar, Toolbar, List, Divider, ListItem, ListItemIcon, Avatar, IconButton, ListItemText} from '@material-ui/core'

// importing icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';

import DesktopDrawer from './desktopDrawer';
import DesktopAppBar from './desktopAppBar';


// styles for a desktop navbar
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        width: "100%",
        height: "100vh",
        paddingTop: 64
    }
}));

function DesktopNavbar(props) {
    const classes = useStyles();
    const theme = useTheme();
    //const [open, setOpen] = React.useState(false);
    var open = props.open
    var setOpen = props.setOpen

    const handleDrawerSwitch = () => {
        if (open) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    function openProfile() {
        let role = props.user.claims.role
        
        // if (role == "ADMIN") {
        //     props.history.push("/adminApp/profile")
        // } else if (role == "COACH") {
        //     props.history.push("/coachApp/coachId=" + props.user.uid + "/profile")
        // } else if (role == "SPORTSMAN") {
        //     props.history.push("/sportsmanApp/userId=" + props.user.uid + "/profile")
        // }

        if (role == "ADMIN") {
            props.history.push("/adminApp")
        } else if (role == "COACH") {
            props.history.push("/coachApp/coachId=" + props.user.uid)
        } else if (role == "SPORTSMAN") {
            props.history.push("/sportsmanApp/userId=" + props.user.uid)
        }
    }

    function handleMenuButtonClick(destination) {
        let role = props.user.claims && props.user.claims.role
        
        if (role == "ADMIN") {
            props.history.push("/adminApp" + destination)
        } else if (role == "COACH") {
            props.history.push("/coachApp/coachId=" + props.user.uid + "" + destination)
        } else if (role == "SPORTSMAN") {
            props.history.push("/sportsmanApp/userId=" + props.user.uid + "" + destination)
        }else{
            // if the user is not logged in
            props.history.push(destination)
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />

            {/* Desktop Appbar */}
            <DesktopAppBar open={open} user={props.user} openProfile={openProfile} goToPage={props.history.push}/>

            {/* Desktop drawer */}
            <DesktopDrawer open={open} menuItems={props.menuItems} handleMenuButtonClick={handleMenuButtonClick} handleDrawerSwitch={handleDrawerSwitch}/>

            {/* Page Content */}
            <div className={classes.content}>
                {props.children}
            </div>


        </div>
    );
}

export default withRouter(DesktopNavbar);