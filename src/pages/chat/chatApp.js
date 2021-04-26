//<-----------------------CHAT COMPONENT FOR CHAT PAGE----------------------->//
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupChatItem from "./groupChatItem"

import Chat from "./chat"
import ChatItem from "./chatItem"

import Paper from '@material-ui/core/Paper';

//styles
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: "30px 0px 0px 0px"
    },
    gridItem: {
        padding: "1em"
    },
    upcomingDeadlinesCard: {
        height: 300,
        padding: 20
    },
    card: {
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    chartCard: {
        height: 400,
        padding: 20,
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    card1: {
        minHeight: 300,
        [theme.breakpoints.up("md")]: {
            height: "30vh"
        },
        overflowY: "scroll"
    },
    searchBtn: {
        height: 45
    },
    searchInput: {
        height: "45px",
        boxSizing: "border-box"
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

}));



function ChatComponent(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [chatGroups, setChatGroups] = useState([])
    const [hidden, setHidden] = useState(false)
    const [currentChat, setCurrentChat] = useState()
    const [allUsers, setAllUsers] = useState([])
    //function for adding new training groups

    useEffect(() => {
        //setAllMessages(init_messages)
        //firebase.getChatData("zYQ7D0Pt2qI07u5nKT3J", )
        if(props.mode === "GROUP"){
            return firebase.getGroupChatsForTrainingGroup(props.group.id, setChatGroups)
        }else{
            return firebase.getAllUserChats(props.user.uid, setChatGroups)
        }
        
    }, [props.user])

    console.log("currentChat")
    console.log(currentChat)

    useEffect(() => {
        //setChatGroups(init_chats)
        if(props.mode !== "GROUP"){
            firebase.getAllUsers({ role: "ALL" }, setAllUsers)
        }
        
        
    }, [])

    function toggleHidden() {
        setHidden((prevState) => {
            return !prevState
        })
    }

    //function to check if selected user is already in existing chat
    function DoesChatExist(userId) {
        let res = false
        chatGroups.forEach((chat, index) => {
            if (chat.members[0].uid === userId) {
                res = true
                return res
            }
        })
        return res
    }

    function handleAddPersonalChat(member){
        console.log("Selected user: ")
        console.log(member)
        let chatExists = DoesChatExist(member.id)
        if (chatExists) {
            alert("Chat with this user already exists!")
            return
        }

        //let memberId = window.prompt("Enetr memberId: ")
        if (member) {
            let user = {
                name: props.user.displayName.split(" ")[0],
                surname: props.user.displayName.split(" ")[1],
                uid: props.user.uid,
                photoURL: props.user.photoURL,
                role: props.user.claims.role
            }
            firebase.getUserInfoById(member.id).then(member => {
                firebase.addNewChat([member, user])
            })

        }
        setOpen(false)
    }

    function handleAddGroupChat(){
        alert("Adding group chat!")
        console.log(props.group.members)
        const chatName = window.prompt("Enter chat name: ")
        firebase.addNewGroupChat(props.group.id, props.group.members, chatName)
    }

    function getMemberNames(members) {
        let names = []
        members.forEach((member) => {
            names.push(member.name)
        })
        return names.join(",")
    }


    //render list of users to text
    const usersGrid = (
        <List>

            {allUsers.map((user, index) => {
                return (
                    <ListItem button key={index} style={{ padding: 5, display: user.id === props.user.uid ? "none" : "block" }}>
                        <Paper style={{ width: "100%", height: "60px", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={() => handleAddPersonalChat(user)}>
                            <Avatar src={user && user.photoURL} />
                            <div>
                                <h4 style={{ display: "inline", margin: 0 }}>{user.name + " " + user.surname}</h4>
                            </div>

                        </Paper>
                    </ListItem>
                )
            })}

        </List>
    )

    const chatsGrid = (
        <List>

            {chatGroups.map((chat, index) => {
                let membersStr = getMemberNames(chat.members)
                if(props.mode === "GROUP"){
                    return(
                        <GroupChatItem key={index} setCurrentChat={setCurrentChat} chat={chat} membersStr={membersStr} mode={props.mode}/>
                    )
                }else{
                    return (
                        <ChatItem key={index} setCurrentChat={setCurrentChat} chat={chat} membersStr={membersStr} mode={props.mode}/>
                    )
                }
            })}

        </List>
    )

    function handleButtonClick(){
        if(props.mode === "GROUP"){
            handleAddGroupChat()
        }else{
            setOpen(true)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", flexWrap: "nowrap" }}>

            <div className="ChatList" style={{ width: "25%", border: "1px solid black", display: hidden ? "none" : "flex", flexDirection: "column", overflow: "hidden" }}>
                <Paper square>
                    <h1>Chat list</h1>
                </Paper>

                {open ?
                    <div square style={{ flexGrow: 1, overflowY: "scroll" }}>
                        <Button color="secondary" onClick={() => setOpen(false)}>Back</Button>
                        {usersGrid}
                    </div>
                    :
                    <div square style={{ flexGrow: 1, overflow: "hidden"}} >
                        {chatsGrid}
                    </div>
                }
                <Paper square>
                    <center><Button onClick={handleButtonClick}>Add new chat</Button></center>
                </Paper>


            </div>

            <div className="CurrentChat" style={{ width: hidden ? "100%" : "75%", border: "1px solid black", position: "relative", height: "100%", overflow: "hidden hidden" }}>

                <Chat toggleHidden={toggleHidden} chat={currentChat} mode={props.mode}/>

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


export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);