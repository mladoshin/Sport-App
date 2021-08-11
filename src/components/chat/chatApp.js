//<-----------------------CHAT COMPONENT FOR CHAT PAGE----------------------->//
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { List, ListItem, Paper, Button, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";

// importing required components
import GroupChatItem from "./groupChatItem"
import Chat from "./chat"

// link to db custom methods
import firebase from '../../firebase/firebase';

import { useCollection } from 'react-firebase-hooks/firestore';
import getRecipient from "../../utils/getRecipient";
import doesChatExist from "../../utils/doesChatExist";
import CustomListItem from "./customListItem";
import getMembersNames from "../../utils/getMembersNames";

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
    outerWrapper: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        minHeight: 500,
        flexWrap: "nowrap"
    },
    innerContainer: {
        width: "25%",
        border: "1px solid black",
        flexDirection: "column",
        overflow: "hidden"
    },
    usersGridWrapper: {
        flexGrow: 1,
        overflowY: "scroll"
    },
    chatsGridWrapper: {
        flexGrow: 1,
        overflowY: "hidden"
    },
    currentChat: {
        border: "1px solid black",
        position: "relative",
        height: "100%",
        minHeight: 500,
        overflow: "hidden hidden"
    }
}));

function UsersListComponent({ allUsers, owner, handleAddPersonalChat, setOpen, goToProfile }) {
    const classes = useStyles();

    function onAvatarClick(uid){
        goToProfile(uid)
    }

    return (
        <div square className={classes.usersGridWrapper}>
            <Button color="secondary" onClick={() => setOpen(false)}>Back</Button>

            <List>

                {allUsers.map(user => {
                    if (user.id !== owner.uid) {
                        return (
                            <CustomListItem onClick={() => handleAddPersonalChat(user)} recipient={user} onAvatarClick={()=>onAvatarClick(user.id)}/>
                        )
                    }
                })}

            </List>

        </div>

    )
}

function ChatsListComponent({ chats, setCurrentChat, mode, goToProfile }) {
    const classes = useStyles();

    function deleteChat(chatId) {
        console.log("Deleting the chat with ID: " + chatId)
        const consent = window.confirm("Are you sure you want to delete the chat?")
        if (consent) {
            firebase.firedDB.collection("chat-groups").doc(chatId)
                .delete()
                .catch(err => console.log(err))
        }

    }

    function onAvatarClick(uid){
        goToProfile(uid)
    }

    const chatsGrid = (
        <List>

            {chats?.docs.map((doc, index) => {
                let chat = doc.data()
                chat.chatId = doc.id
                console.log(chat)

                let membersStr = getMembersNames(chat.membersInfo)

                let recipients = getRecipient(chat.membersInfo, firebase.getCurrentUserId())


                if (mode === "GROUP") {
                    return (
                        <GroupChatItem key={index} setCurrentChat={setCurrentChat} chat={chat} membersStr={membersStr} mode={mode} recipients={recipients} />
                    )
                } else if(!chat.groupId){
                    //render this item only if this is not a group chat
                    return (
                        <CustomListItem onClick={() => setCurrentChat(chat)} recipient={recipients[0]} onRightClick={() => deleteChat(chat.chatId)} onAvatarClick={()=>onAvatarClick(recipients[0]?.uid)}/>
                    )
                }
            })}

        </List>
    )

    return (
        <div square className={classes.chatsGridWrapper}>
            {chatsGrid}
        </div>
    )
}

function ChatComponent(props) {
    
    const classes = useStyles();
    const dbQuery = props.mode === "GROUP" ? firebase.fireDB.collection("chat-groups").where("groupId", "==", props.group.id) : firebase.fireDB.collection("chat-groups").where("memberIDs", "array-contains", firebase.getCurrentUserId())
    const [open, setOpen] = useState(false)
    const [chatGroups, setChatGroups] = useState([])
    const [chats, loading, error] = useCollection(
        dbQuery
    )
    const [hidden, setHidden] = useState(false)
    const [currentChat, setCurrentChat] = useState()
    const [allUsers, setAllUsers] = useState([])
    //function for adding new training groups

    useEffect(() => {
        //setChatGroups(init_chats)
        if (props.mode !== "GROUP") {
            firebase.getAllUsers({ role: "ALL" }, setAllUsers)
        }
    }, [])

    function toggleHidden() {
        setHidden((prevState) => {
            return !prevState
        })
    }

    function goToProfile(uid){
        props.history.push("/viewProfile/uid="+uid)
    }

    // function for adding a new personal chat
    function handleAddPersonalChat(member) {
        // console.log("Selected user: ")
        // console.log(member)
        let chatExists = doesChatExist(chats, member.id)
        console.log(chatExists)
        if (chatExists) {
            // if the chat already exists, then alert the error
            alert("Chat with this user already exists!")
            return
        }

        // if the person exists, then create a new chat in the db
        if (member) {
            let user = {
                name: props.user.displayName.split(" ")[0],
                surname: props.user.displayName.split(" ")[1],
                uid: props.user.uid,
                photoURL: props.user.photoURL,
                role: props.user.claims.role
            }
            firebase.getUserInfoById(member.id).then(member => {
                // adding a new chat to db here
                firebase.addNewChat([member, user])
            })

        }
        setOpen(false)
    }

    function handleAddGroupChat() {
        alert("Adding group chat!")
        console.log(props.group.members)
        const chatName = window.prompt("Enter chat name: ")
        firebase.addNewGroupChat(props.group.id, props.group.members, chatName)
    }

    function handleButtonClick() {
        if (props.mode === "GROUP") {
            handleAddGroupChat()
        } else {
            setOpen(true)
        }
    }

    return (
        <div className={classes.outerWrapper}>

            <div className={classes.innerContainer} style={{ display: hidden ? "none" : "flex" }}>
                <Paper square>
                    <h1>Chat list</h1>
                </Paper>

                {open ?
                    <UsersListComponent allUsers={allUsers} owner={props.user} handleAddPersonalChat={handleAddPersonalChat} setOpen={setOpen} goToProfile={goToProfile}/>
                    :
                    <ChatsListComponent chats={chats} setCurrentChat={setCurrentChat} mode={props.mode} goToProfile={goToProfile}/>
                }
                <Paper square>
                    <center><Button onClick={handleButtonClick}>Add new chat</Button></center>
                </Paper>

            </div>

            <div className={classes.currentChat} style={{ width: hidden ? "100%" : "75%" }}>

                {currentChat ? <Chat toggleHidden={toggleHidden} chat={currentChat} mode={props.mode} membersInfo={props.group?.membersInfo}/> : <h3>Select a chat in the sidebar</h3>}

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
        setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatComponent));