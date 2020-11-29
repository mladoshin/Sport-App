import React, {useState} from "react"
import { Grid, Badge, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MUIAvatar from './avatar'
import clsx from "clsx"

const useStyles = makeStyles((theme) => ({
    grid: {
        width: 200,
        padding: 0,
        flexGrow: 1,
        justifyContent: "flex-end",
        alignContent: "center",
    },
    gridItem: {
        padding: 0,
        height: 40
    },
    avatarGridItem: {
        marginLeft: 15
    }
  }));

function AccountToolbar(props){
    const classes = useStyles();

    return(
        <Grid container className={classes.grid}>
            <Grid item className={classes.gridItem}>

                <IconButton onClick={(e)=>props.setNotificationAnchor(e.currentTarget)}>
                    <Badge badgeContent={props.notificationsNumber} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>

            </Grid>
            <Grid item className={clsx(classes.gridItem, classes.avatarGridItem)} onClick={(e)=>props.setAccountAnchor(e.currentTarget)}>
                <MUIAvatar avatarAlt={props.avatarAlt} url={props.url}/>
            </Grid>
        </Grid>
    )
}

export default AccountToolbar;
