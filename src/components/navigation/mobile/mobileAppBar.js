import React from 'react'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, IconButton, CssBaseline } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';

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

export default function MobileAppBar({ open, toggleDrawer, openProfile, user, goToPage }) {
    const classes = useStyles();

    return (
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
                {user.uid ? 
                    <div>
                        <IconButton><NotificationsRoundedIcon /></IconButton>
                        <IconButton style={{ marginLeft: 0 }} onClick={() => openProfile()}><Avatar alt="User" src={user.photoURL} className={classes.avatar}>{user.name}</Avatar></IconButton>
                    </div>
                    :
                    <Button color="inherit" onClick={() => goToPage("/login")}>Login</Button>
                }

            </Toolbar>
        </AppBar>
    )
}