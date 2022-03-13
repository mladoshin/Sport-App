import React from "react"
import { Grid, Paper, Avatar } from "@material-ui/core"
import "./chat.css"
import clsx from 'clsx';
import parse from 'html-react-parser';
import firebase from '../../firebase/firebase';
import isMessageALink from "../../utils/isMessageALink";
import CustomAvatar from "../common/avatar"

function PhotoGrid({fileURLs}) {
    return (
        <Grid container>
            {fileURLs?.map(url => {
                return (
                    <PhotoElement url={url}/>
                )
            })}
        </Grid>
    )
}

function PhotoElement({url}) {
    return (
        <Grid item xs={12} xl={6}>
            <img src={url} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
        </Grid>
    )
}

function Message(props) {
    const message = props.message
    const index = props.index
    const float = props.isUser ? "right" : "left"
    const bgColor = props.isUser ? "#7986cb" : "#e0e0e0"

    //beta functionality (links)
    let text = message.text

    if (isMessageALink(text)) {

        text = "<a href=" + text + ">" + text + "</a>"
        text = parse(text)
        console.log("parsed text")
        console.log(text)
    }

    return (
        <Grid
            key={index}
            item
            xs={12}
            style={{ padding: 5, position: "relative", width: "100%" }}
        >
            <div
                className={props.isUser ? "message__wrapper_user" : "message__wrapper"}
            >
                <CustomAvatar
                    user={{ photoURL: message.senderPhotoURL, uid: message.senderId }}
                    disableRipple btnStyle={{ padding: 0, marginLeft: props.isUser && 10, marginRight: !props.isUser && 10 }}
                />
                <Paper
                    className={clsx("message__paper_base", props.isUser && "message__paper_user", !props.isUser && "message__paper")}
                >
                    {text}

                    {/* Display images */}
                    { message.fileURLs && <PhotoGrid fileURLs={message.fileURLs}/> }
                </Paper>
            </div>

        </Grid>
    )
}
export default Message