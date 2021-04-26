import React, {useState, useEffect, useRef} from "react"
import { ListItem, Paper, Avatar } from "@material-ui/core"
import firebase from '../../firebase/firebase';
import { Suspense } from "react";

function GroupChatItem(props) {
    const chat = props.chat
    const membersStr = props.membersStr
    const setCurrentChat = props.setCurrentChat


    useEffect(()=>{
        if (props.mode !== "GROUP"){
            
        }
        
        
    }, [props.chat])

    return (
        <ListItem button style={{ padding: 5}}>
            
            <Paper style={{ width: "100%", height: "60px", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={() => setCurrentChat(chat)}>
                
                <div>
                    <h4 style={{ display: "inline", margin: 0 }}>{chat.title}</h4>
                    <p>{chat.members.join(", ")}</p>
                </div>

            </Paper>
            
        </ListItem>
    )
}
export default GroupChatItem