import React, {useState, useEffect} from "react"
import { Paper, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
import { connect } from "react-redux"
import firebase from '../../firebase/firebase';
import Message from "./message"


function Chat(props) {
    const [allMessages, setAllMessages] = useState([])
    const [chatData, setChatData] = useState({})
    const [message, setMessage] = useState("")
    const [chatName, setChatName] = useState("")
    const chat = props.chat

    useEffect(()=>{
        //useEffect for smooth scrolling to bottom
        scrollToBottom()

    }, [allMessages])

    console.log(allMessages)


    useEffect(()=>{
        

        //setAllMessages(init_messages)
        if(chat){
            let names = []
            chat.members.forEach((member, index) => {
                let name = member.name+" "+member.surname
                names.push(name)
            })
            setChatName(names.join(","))

            //console.log("chatId = "+props.chat.chatId)
            firebase.getChatData(chat.chatId, setChatData, setAllMessages )
        }

        return () => {
            console.log("Cleanup")
            setMessage("")
            setAllMessages([])
          };
        
    }, [chat])

    function scrollToBottom(){
        let container = document.getElementById("chat-container");
        console.log(container.clientHeight)
        console.log("scrolling")
        //container.scrollTop = container.scrollHeight
        container.scroll({
            top: container.scrollHeight,
            left: 0,
            behavior: "smooth"
        })
    }   

    //console.log(allMessages)
    //console.log(chatData)

    function handleAddMessage(){
        let sender = {
            name: props.user.displayName,
            uid: props.user.uid,
            photoURL: props.user.photoURL
        }

        if(message && chat){
            firebase.addMessageToChat(sender, message, chat.chatId)
        }
        
        //setAllMessages([...allMessages, newMessage])
        setMessage("")
    }

    const messagesList = (
        <Grid container spacing={0} style={{overflowX: "hidden"}} id="chat-container">
            {allMessages.map((message, index) => {
                let isUser = props.user.uid === message.senderId
                let float= "left"
                let photoURL = ""

                if(props.user.uid == message.senderId){
                    float="right"
                    photoURL = props.user.photoURL
                }else{
                    photoURL = chat.members[0].photoURL
                }

                let fullMessage = {...message, senderPhotoURL: photoURL, senderName: chat.members[0].name}

                return(
                    <Message message={fullMessage} float={float} index={index} isUser={isUser} key={index}/>
                )
            })}
        </Grid>
        
    )
    

    return (
        <div container style={{ display: "flex", flexDirection: "column", alignContent: "space-between", height: "100%" }}>
            <div style={{ height: 50, width: "100%" }}>

                <Paper square>
                    <Button size="small" onClick={() => props.toggleHidden()}>Hide list</Button>
                    <h1 style={{ margin: 0, display: "inline" }}>{chatName}</h1>
                </Paper>
            </div>

            <div style={{ flexGrow: 1, width: "100%", overflowX: "hidden", overflowY: "scroll" }} id="chat-container">
                <Paper style={{ minHeight: "100%"}} square>
                    {allMessages.length > 0 ? messagesList : "The chat is empty"}
                </Paper>
            </div>

            <div style={{ height: 50, width: "100%", borderTop: "1px solid black" }}>
                <Paper style={{ display: "flex", flexDirction: "row", height: "100%" }} square>
                    <Button color="primary" style={{ height: 50, width: 50 }}>Attach</Button>
                    <input style={{ flexGrow: 1, height: 50 }} value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button color="secondary" style={{ height: 50, maxWidth: 150 }} onClick={handleAddMessage}>Send</Button>
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
        //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
        //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
        //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
        //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)