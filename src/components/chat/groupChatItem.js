import React, {useState, useEffect, useRef} from "react"
import { ListItem, Paper, Avatar } from "@material-ui/core"
import {withRouter} from "react-router";

function GroupChatItem(props) {
    const chat = props.chat
    console.log(chat)

    function handleGroupChatClick(){
        props.history.push("/chats/chatId="+chat.chatId)
    }

    return (
        <ListItem button style={{ padding: 5}}>
            
            <Paper style={{ width: "100%", height: "60px", display: "flex", flexDirection: "row", alignItems: "center", padding: 10 }} onClick={handleGroupChatClick}>
                
                <div style={{height: 25}}>
                    <h4 style={{ display: "inline", margin: 0 }}><strong style={{fontSize: 20}}>{chat.groupName}</strong>{" ("+chat.title+")"}</h4>
                    <p>{chat?.members?.join(", ")}</p>
                </div>

            </Paper>
            
        </ListItem>
    )
}
export default withRouter(GroupChatItem)