// <---------- Navbar for desktop devices---------->

import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core'

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
        props.history.push("/home")
    }

    function handleMenuButtonClick(destination) {
        let role = props.user.claims && props.user.claims.role
        
        if (role == "ADMIN") {
            props.history.push("/adminApp" + destination)
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