import React from "react"
import { ListItem, Paper, Avatar } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';

//styles
const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: 5
    },
    paper: {
        width: "100%", 
        height: "60px", 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",

    },
    textHeading: {
        display: "inline", 
        margin: 0
    },
    nameWrapper: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center"
    }

}));

function CustomListItem(props) {
    const classes = useStyles();
    const chat = props.chat
    const setCurrentChat = props.setCurrentChat
    const userName = props.recipient.name + " " + props.recipient.surname

    console.log(props.recipient)

    return (
        <ListItem button className={classes.listItem}>
            
            <Paper className={classes.paper} >
                <Avatar src={props.recipient.photoURL} onClick={props.onAvatarClick} style={{marginRight: 15, marginLeft: 15}}/>
                <div onClick={props.onClick} onContextMenu={props.onRightClick} className={classes.nameWrapper}>
                    <h4 className={classes.textHeading}>{props.mode !== "GROUP" ? userName : props.chat.members.join(", ")}</h4>
                    
                </div>

            </Paper> 
        </ListItem>
    )
}

export default CustomListItem
