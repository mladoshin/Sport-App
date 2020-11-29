import React from "react"
import { Avatar } from '@material-ui/core'

function MUIAvatar(props){
    const avatarAlt = props.avatarAlt ? props.avatarAlt.toUpperCase() : null
    return(
    <Avatar alt={avatarAlt} src={props.url ? props.url : null}>{avatarAlt}</Avatar>
    );
}

export default MUIAvatar;