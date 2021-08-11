import React, { useState, useEffect } from "react"
import { Paper, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
import { connect } from "react-redux"
import firebase from '../../firebase/firebase';
import Message from "./message"
import { useCollection } from 'react-firebase-hooks/firestore';
import getRecipient from "../../utils/getRecipient";
import getSenderPhotoURL from "../../utils/getSenderPhotoURL";

function Chat(props) {
    const chat = props.chat
    const membersInfo = props.membersInfo
    const [allMessages, loading, error] = useCollection(firebase.fireDB.collection("chat-groups").doc(chat?.chatId).collection("messages").orderBy("timestamp", "asc"))
    const [message, setMessage] = useState("")
    const [chatName, setChatName] = useState("")
    
    const chatTitle = chat ? chat.title : null

    console.log(props)
    useEffect(() => {
        //useEffect for smooth scrolling to bottom
        scrollToBottom()

    }, [allMessages])


    useEffect(() => {
        if (chat && !chat.groupId) {
            let recipients = getRecipient(chat.membersInfo, firebase.getCurrentUserId()).map(recipient => recipient.name+" "+recipient.surname)          
            setChatName(recipients.join(","))
        }

        return () => {
            console.log("Cleanup")
            setMessage("")
            //setAllMessages([])
        };

    }, [chat])

    function scrollToBottom() {
        let container = document.getElementById("chat-container");

        //container.scrollTop = container.scrollHeight
        container.scroll({
            top: container.scrollHeight,
            left: 0,
            behavior: "smooth"
        })
    }

    function handleAddMessage() {
        let sender = {
            name: props.user.displayName,
            uid: props.user.uid
        }

        if (message && chat) {
            console.log(chat)
            firebase.addMessageToChat(sender, message, chat.chatId)
        }
        // clear the input field
        setMessage("")
    }

    const messagesList = (
        <Grid container spacing={0} style={{ overflowX: "hidden" }} id="chat-container">
            {allMessages?.docs.map((doc, index) => {
                let message = doc.data()
                message.id = doc.id

                let isUser = props.user.uid === message.senderId
                let float = "left"
                let photoURL = ""

                if (props.user.uid == message.senderId) {
                    float = "right"
                    photoURL = props.user.photoURL
                } else {
                    photoURL = getSenderPhotoURL(props.mode !== "GROUP" ? chat.membersInfo : membersInfo, message.senderId)
                }

                let fullMessage = { ...message, senderPhotoURL: photoURL, senderName: message.senderName }

                return (
                    <Message message={fullMessage} float={float} index={index} isUser={isUser} key={index} />
                )
            })}
        </Grid>

    )

    function handleKeyUp(e){
        if(e.key === "Enter"){
            handleAddMessage()
        }
    }


    return (
        <div className="chat-wrapper">
            <div className="chatHeader">
                <Paper square>
                    <Button size="small" onClick={() => props.toggleHidden()}>Hide list</Button>
                    <h1 style={{ margin: 0, display: "inline" }}>{props.mode === "GROUP" ? chatTitle : chatName}</h1>
                </Paper>
            </div>

            <div id="chat-container">
                <Paper className="chat-container-paper" square>
                    {allMessages?.docs.length > 0 ? messagesList : "The chat is empty"}
                </Paper>
            </div>

            <div className="chat-footer">
                <Paper className="chat-footer-paper" square>
                    <Button color="primary" className="atttachBtn">Attach</Button>
                    <input className="messageInput" value={message} onChange={(e) => setMessage(e.target.value)} onKeyUp={handleKeyUp}/>
                    <Button color="secondary" className="sendBtn" onClick={handleAddMessage}>Send</Button>
                </Paper>

            </div>


        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        theme: state.theme
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
        setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)