import React, { useState, useEffect } from "react"
import { Paper, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
import { connect } from "react-redux"
import CloseIcon from "@material-ui/icons/Close"
import firebase from '../../firebase/firebase';
import Message from "./message"
import { withRouter } from "react-router";
import getRecipient from "../../utils/getRecipient";
import getSenderPhotoURL from "../../utils/getSenderPhotoURL";
import CustomAvatar from "../common/avatar"
import convertImagesToBlob from "../../utils/convertImagesToBlob";

import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import ChatHeader from "./chatHeader";


function ChatAttachmentPreview({ attachments, clearFiles, removeFile }) {
    const open = Boolean(attachments.length > 0)
    console.log(open)

    return (
        <>
            {open &&
                <Paper className="attachmentArea" square style={{ visibility: open ? "visible" : "hidden", position: "relative" }}>
                    <IconButton style={{ position: "absolute", top: 10, right: 10 }} onClick={clearFiles}>
                        <CloseIcon />
                    </IconButton>
                    <Grid container style={{ minHeight: "100%" }}>
                        {Array.from(attachments)?.map((file, index) => {
                            let url = URL.createObjectURL(file)
                            
                            let isIMG = false
                            if(file.type=="image/jpeg" || file.type=="image/png"){
                                isIMG=true
                            }
                            console.log(isIMG)
                            return (
                                <Grid item key={index} xs={6} md={4} lg={3} xl={2} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Card style={{ height: 130, aspectRatio: "1/1", padding: 3, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                                        <b style={{ position: "absolute", top: 5, maxWidth: "70%" }}>{file.name}</b>
                                        <IconButton style={{position: "absolute", top: 5, right: 5, padding: 3}} onClick={()=>removeFile(index)}><CloseIcon style={{width: 15, height: 15, color: "red"}}/></IconButton>
                                        {isIMG ? <img src={url} style={{ objectFit: "contain", height: "100%", }} /> : <InsertDriveFileRoundedIcon/>}

                                    </Card>

                                </Grid>
                            )
                        })}
                    </Grid>

                </Paper>
            }
        </>

    )
}

function Chat(props) {
    const chat = props.chat
    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        //useEffect for smooth scrolling to bottom
        scrollToBottom()
    }, [allMessages])


    useEffect(() => {
        if (chat && !chat.groupId) {
            firebase.getChatMessages(chat.chatId, setAllMessages, chat.membersInfo)
        } else if (chat && chat.groupId) {
            firebase.getChatMessages(chat.chatId, setAllMessages, chat.membersInfo)
        }

        return () => {
            console.log("Cleanup")
            setMessage("")
        };

    }, [props.chat])

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

        if (files.length > 0) {
            //upload documents
            convertImagesToBlob(files).then(res => {
                console.log(res)
                //upload images here
                firebase.uploadFilesToChat(res, chat.chatId).then(urls => {
                    //upload urls to the messages
                    //console.log(urls)
                    firebase.addMessageToChat(sender, message, chat.chatId, urls)
                })
            })
            setMessage("")
            return
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
            {allMessages?.map((doc, index) => {
                let message = doc

                let isUser = props.user.uid === message.senderId
                let float = "left"

                return (
                    <Message message={doc} float={float} index={index} isUser={isUser} key={index} />
                )
            })}
        </Grid>

    )

    function handleKeyUp(e) {
        if (e.key === "Enter") {
            handleAddMessage()
        }
    }

    function hadleAttachClick() {
        let inp = document.getElementById("fileInput")
        inp.click()
    }

    function handleAttachFile(e) {
        console.log(e.target.files)
        e.target.files.length > 0 && setFiles(e.target.files)
    }

    function clearFiles() {
        setFiles([])
    }

    function removeFile(index){
        setFiles(state => {
            let newState = Array.from(state)
            console.log(newState)
            newState.splice(index, 1)
            return [...newState]
        })
    }


    return (
        <div className="chat-wrapper">
            <ChatHeader chat={chat} toggleHidden={props.toggleHidden} isGroupChat={props.isGroupChat} deleteChat={props.deleteChat} history={props.history}/>

            <div id="chat-container">
                <Paper className="chat-container-paper" square>
                    {allMessages?.length > 0 ? messagesList : "The chat is empty"}
                </Paper>
            </div>

            <div className="chat-footer">

                <ChatAttachmentPreview attachments={files} clearFiles={clearFiles} removeFile={removeFile} />
                <Paper className="chat-footer-paper" square>
                    <Button color="primary" className="atttachBtn" onClick={hadleAttachClick}>Attach</Button>
                    <input type="file" hidden id="fileInput" onChange={handleAttachFile} multiple />
                    <input className="messageInput" value={message} onChange={(e) => setMessage(e.target.value)} onKeyUp={handleKeyUp} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Chat))