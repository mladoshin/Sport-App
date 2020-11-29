import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Menu, MenuItem, Divider, Paper, Typography } from '@material-ui/core';
import firebase from "../../firebase/firebase"


const useStyles = makeStyles((theme) => ({
    NotificationMenu: {
        position: "absolute",
        right: "50px",
        top: 60
    },
    InnerMenu: {
        display: "flex",
        flexDirection: "column",
        minWidth: 250,
        height: 150,
        overflowY: "scroll"
    },
    NotificationPaper: {
        width: "94%",
        padding: 7,
        marginLeft: "auto",
        marginRight: "auto",
        height: "auto"
    }
}));


function NotificationMenu(props) {
    const notificationAnchor = props.notificationAnchor
    const setNotificationAnchor = props.setNotificationAnchor
    const classes = useStyles()


    const notificationItems = []
    props.notifications.map((notification, index) => {
        if (firebase.auth.currentUser.emailVerified && notification.type === "VERIFICATION") {
            firebase.removeNotification(notification.id, "VERIFIED")
        } else {
            notificationItems.push(
                <div key={index}>
                    <MenuItem onClick={() => firebase.removeNotification(notification.id, notification.type)} disableGutters={true}>
                        <Paper className={classes.NotificationPaper}>
                            <Typography variant="body1" style={{width: "100%", whiteSpace: "normal"}}>{notification.text}</Typography>
                            <Typography variant="caption" style={{width: "100%", whiteSpace: "normal"}}>{new Date(notification.date).toDateString() +", "+new Date(notification.date).toLocaleTimeString()}</Typography>
                        </Paper>
                    </MenuItem>
                </div>
            )
        }

    })
    return (
        <Menu
            id="notification-menu"
            anchorEl={notificationAnchor}
            keepMounted
            open={Boolean(notificationAnchor)}
            onClose={() => setNotificationAnchor(null)}
            style={{position: "absolute", top: 60, right: 50}}
            className={classes.NotificationMenu}
        >
            <div className={classes.InnerMenu}>
                {notificationItems}
            </div>


        </Menu>
    )
}

export default NotificationMenu;