//<-----------------------MOBILE NAVBAR COMPONENT----------------------->//
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, IconButton, CssBaseline } from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';

import MobileDrawer from "./mobileDrawer"
import MobileAppBar from './mobileAppBar';


//drawer width constant
const drawerWidth = 240;

//styles
const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    content: {
        width: "100%",
        height: "100vh",
        paddingTop: 56
    }
}));

//mobile navbar component
function MobileNavbar(props) {
    const classes = useStyles();
    
    var open = props.open
    var setOpen = props.setOpen

    //function to toggle the drawer
    const toggleDrawer = (open) => {
        setOpen(open);
    };

    //function for opening the user's profile
    function openProfile() {
        let role = props.user.claims.role

        if (role == "ADMIN") {
            props.history.push("/adminApp")
        } else{
            props.history.push("/home")
        }

    }

    //function for redirecting to the right page, after user have clicked on the menu item
    function handleMenuButtonClick(destination) {
        //user's role 
        let role = props.user.claims && props.user.claims.role
        
        if (role == "ADMIN") {
            props.history.push("/adminApp" + destination)
            toggleDrawer(false)
        } else{    
            props.history.push(destination)
            toggleDrawer(false)
        }
    }

    return (
        <div>
            <React.Fragment>
                <CssBaseline />
                <MobileAppBar open={open} toggleDrawer={toggleDrawer} openProfile={openProfile} user={props.user} goToPage={props.history.push}/>

                {/* <AppBar
                    position="fixed"
                    className={clsx(classes.appBar)}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => toggleDrawer(true)}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                            LOGO
                        </Typography>
                        <div>
                            <IconButton><NotificationsRoundedIcon /></IconButton>
                            <IconButton style={{ marginLeft: 0 }} onClick={() => openProfile()}><Avatar alt="User" src={props.user.photoURL} className={classes.avatar}>{props.user.name}</Avatar></IconButton>
                        </div>
                    </Toolbar>
                </AppBar> */}
                
                <MobileDrawer open={open} setOpen={setOpen} menuItems={props.menuItems} goToPage={props.history.push} handleMenuButtonClick={handleMenuButtonClick}/>

            </React.Fragment>

            <div className={classes.content}>
                {props.children}
            </div>


        </div>
    );
}

export default withRouter(MobileNavbar)