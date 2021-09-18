import React from "react"
import { Grid, Paper, Avatar } from "@material-ui/core"
import "./chat.css"
import clsx from 'clsx';
import parse from 'html-react-parser';
import firebase from '../../firebase/firebase';
import isMessageALink from "../../utils/isMessageALink";
import CustomAvatar from "../common/avatar"

function Message(props){
    const message = props.message
    const index = props.index
    const float = props.isUser ? "right" : "left"
    const bgColor = props.isUser ? "#7986cb" : "#e0e0e0"

    //beta functionality (links)
    let text = message.text
    /*let wordList = message.text.split(" ")
    let parsed_text = ""
    wordList.forEach((word) => {
        let text = word
        if(firebase.isMessageLink(word)){    
            text = "<a href="+text+">"+text+"</a>"
            console.log(text)   
        }
        parsed_text += text
    })
    console.log(parsed_text)*/

    if(isMessageALink(text)){
        
        text = "<a href="+text+">"+text+"</a>"
        text = parse(text)
        console.log("parsed text")
        console.log(text)
    }

    return(
        <Grid key={index} item xs={12} style={{padding: 5, position: "relative", width: "100%"}}>
            <div className={props.isUser ? "message__wrapper_user" : "message__wrapper"}>
                <CustomAvatar user={{photoURL: message.senderPhotoURL, uid: message.senderId}} disableRipple btnStyle={{padding: 0, marginLeft: props.isUser && 10, marginRight: !props.isUser && 10}}/>
                <Paper className={clsx("message__paper_base", props.isUser && "message__paper_user", !props.isUser && "message__paper")}>         
                    {text}
                </Paper>
            </div>
            
        </Grid>
    )
}
export default Message