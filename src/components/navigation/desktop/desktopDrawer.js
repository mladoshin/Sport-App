import React from "react"
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, Divider, ListItem, ListItemIcon, IconButton, ListItemText} from '@material-ui/core'

// importing icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;
const closedDrawerWidth = 73;

// styles for a desktop navbar
const useStyles = makeStyles((theme) => ({
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
    }
}));

export default function DesktopDrawer({ open, menuItems, handleMenuButtonClick, handleDrawerSwitch}) {
    const classes = useStyles();

    return (
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

                {menuItems.map((menuItem, index) => {
                    return (
                        <ListItem button key={index} onClick={() => handleMenuButtonClick(menuItem.path)}>
                            <ListItemIcon>{menuItem.icon ? <menuItem.icon/> : null}</ListItemIcon>
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
    )
}