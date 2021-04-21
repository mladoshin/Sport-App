import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { Suspense } from 'react';


const drawerWidth = 240;
const closedDrawerWidth = 73;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
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
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    content: {
        width: "100%",
        height: "100vh",
        paddingTop: 64
    }
}));

function MiniDrawer(props) {
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
        
        if (role == "ADMIN") {
            props.history.push("/adminApp/profile")
        } else if (role == "COACH") {
            props.history.push("/coachApp/coachId=" + props.user.uid + "/profile")
        } else if (role == "SPORTSMAN") {
            props.history.push("/sportsmanApp/userId=" + props.user.uid + "/profile")
        }
    }

    

    function handleMenuButtonClick(destination) {
        let role = props.user.claims.role
        
        if (role == "ADMIN") {
            props.history.push("/adminApp" + destination)
        } else if (role == "COACH") {
            props.history.push("/coachApp/coachId=" + props.user.uid + "" + destination)
        } else if (role == "SPORTSMAN") {
            props.history.push("/sportsmanApp/userId=" + props.user.uid + "" + destination)
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>

                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <div style={{ flexGrow: 1 }}></div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <IconButton><NotificationsRoundedIcon /></IconButton>
                            <Suspense fallback={null}>
                                <IconButton onClick={() => openProfile()}><Avatar alt="User" src={props.user.photoURL} className={classes.avatar}>{props.user.name}</Avatar></IconButton>
                            </Suspense>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >

                <Divider />
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
                <Divider />

                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerSwitch} >
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>


            </Drawer>

            <div className={classes.content}>
                {props.children}
            </div>


        </div>
    );
}

export default withRouter(MiniDrawer);