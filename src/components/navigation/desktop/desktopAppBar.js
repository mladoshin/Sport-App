import React, { Suspense } from "react"
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Drawer, AppBar, Toolbar, List, Divider, ListItem, ListItemIcon, Avatar, IconButton, ListItemText } from '@material-ui/core'
import CustomAvatar from "../../common/avatar"
// importing icons
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';


const drawerWidth = 240;
const closedDrawerWidth = 73;

// styles for a desktop navbar
const useStyles = makeStyles((theme) => ({
    appBar: {
        marginLeft: closedDrawerWidth,
        width: `calc(100% - ${closedDrawerWidth}px)`,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
}));

export default function DesktopAppBar({ open, user, openProfile, goToPage }) {
    const classes = useStyles();

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar>

                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <div style={{ flexGrow: 1 }}></div>

                    {user.uid ?
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <IconButton><NotificationsRoundedIcon /></IconButton>
                            <CustomAvatar user={user} style={{width: 30, height: 30}}/>
                        </div>
                        :
                        <Button color="inherit" onClick={() => goToPage("/login")}>Login</Button>
                    }

                </div>

            </Toolbar>
        </AppBar>
    )
}