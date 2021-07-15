//<-----------------------MOBILE NAVBAR COMPONENT----------------------->//
import React, { useState } from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography, Button, List, Divider, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, IconButton } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';

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

    //function for redirecting to the right page, after user have clicked on the menu item
    function handleMenuButtonClick(destination) {
        //user's role 
        let role = props.user.claims.role
        
        if (role == "ADMIN") {
            props.history.push("/adminApp" + destination)
            toggleDrawer(false)
        } else if (role == "COACH") { 
            props.history.push("/coachApp/coachId=" + props.user.uid + "" + destination)
            toggleDrawer(false)
        } else if (role == "SPORTSMAN") {      
            props.history.push("/sportsmanApp/userId=" + props.user.uid + "" + destination)
            toggleDrawer(false)
        }
    }

    return (
        <div>
            <React.Fragment>
                <CssBaseline />
                <AppBar
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
                </AppBar>

                <Drawer anchor={"left"} open={open} onClose={() => toggleDrawer(false)}>
                    <List>
                        <ListItem>
                            <ListItemText>LOGO</ListItemText>
                        </ListItem>

                        {props.menuItems.map((menuItem, index) => {
                            return (
                                <ListItem button key={index} onClick={() => handleMenuButtonClick(menuItem.path)}>
                                    <ListItemIcon><MailIcon /></ListItemIcon>
                                    <ListItemText>{menuItem.title}</ListItemText>
                                </ListItem>
                            )
                        })}
                    </List>
                </Drawer>

            </React.Fragment>

            <div className={classes.content}>
                {props.children}
            </div>


        </div>
    );
}

export default withRouter(MobileNavbar)