import React from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { withRouter } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import firebase from "../../firebase/firebase"

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
}));

function CustomAvatar({ history, user, style, disableRipple, btnStyle }) {
    const classes = useStyles();

    const openOwnProfile = () => {
        history.push("/home")
    }

    const openUserProfile = () => {
        history.push("/viewProfile/uid="+user.uid)
    }

    const openProfile = () => {
        if(user.uid===firebase.getCurrentUserId()){
            openOwnProfile()
        }else{
            openUserProfile()
        }   
    }

    return (
        <IconButton onClick={openProfile} style={{backgroundColor: disableRipple && "transparent", ...btnStyle}}><Avatar alt="User" src={user?.photoURL} className={classes.avatar} style={style}>{user?.name}</Avatar></IconButton>

    )
}

export default withRouter(CustomAvatar)
