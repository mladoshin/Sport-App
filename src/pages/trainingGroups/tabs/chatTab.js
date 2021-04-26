import React, { useState, useEffect } from "react"
import firebase from "../../../firebase/firebase"
import ChatApp from "../../chat/chatApp"

function ChatTab(props) {
    const [chats, setChats] = useState([])
    const chat = null

    useEffect(()=>{
        console.log(props.group)
        //firebase.getGroupChatsForTrainingGroup(, setChats)
    }, [])

    return (
        <div>
            <h1>Chat Page...</h1>
            <ChatApp group={props.group} mode="GROUP"/>
        </div>
    )
}

export default ChatTab;