//<-----------------------CHAT COMPONENT FOR CHAT PAGE----------------------->//
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { List, ListItem, Paper, Button, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, useParams } from "react-router";

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
import ChatHeader from "./chatHeader";
import ChatAttachments from "./chatAttachments";

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

    function onAvatarClick(uid) {
        goToProfile(uid)
    }

    return (
        <div square className={classes.usersGridWrapper}>
            <Button color="secondary" onClick={() => setOpen(false)}>Back</Button>

            <List>

                {allUsers.map(user => {
                    if (user.id !== owner.uid) {
                        return (
                            <CustomListItem onClick={() => handleAddPersonalChat(user)} recipient={user} onAvatarClick={() => onAvatarClick(user.id)} />
                        )
                    }
                })}

            </List>

        </div>

    )
}

function ChatsListComponent({ chats, groupChats, setCurrentChat, mode, goToProfile, openChat, deleteChat }) {
    const classes = useStyles();
    console.log(mode)

    // function deleteChat(chatId) {
    //     console.log("Deleting the chat with ID: " + chatId)
    //     const consent = window.confirm("Are you sure you want to delete the chat?")
    //     if (consent) {
    //         firebase.firedDB.collection("chat-groups").doc(chatId)
    //             .delete()
    //             .catch(err => console.log(err))
    //     }

    // }

    function onAvatarClick(uid) {
        goToProfile(uid)
    }

    const chatsGrid = (
        <List>

            {chats?.map((chat, index) => {

                let membersStr = getMembersNames(chat.membersInfo)

                let recipients = getRecipient(chat.membersInfo, firebase.getCurrentUserId())
                //let recipientId = recipients[0].uid

                if (mode === "GROUP") {
                    return (
                        <GroupChatItem key={index} setCurrentChat={setCurrentChat} chat={chat} membersStr={membersStr} mode={mode} recipients={recipients} />
                    )
                } else if (!chat.groupId) {
                    //render this item only if this is not a group chat
                    return (
                        <CustomListItem onClick={() => openChat(chat.chatId)} recipient={recipients && recipients[0]} onRightClick={() => deleteChat(chat.chatId)} onAvatarClick={() => onAvatarClick(recipients[0]?.uid)} />
                    )
                }
            })}

            {mode !== "GROUP" && <hr />}

            <div style={{ textAlign: "center" }}><h3>Group chats</h3></div>
            {/* display group chats */}
            {
                groupChats?.map((groupChat, i) => {
                    let membersStr = getMembersNames(groupChat.membersInfo)
                    let recipients = getRecipient(groupChat.membersInfo, firebase.getCurrentUserId())

                    return (
                        <GroupChatItem key={i} setCurrentChat={setCurrentChat} chat={groupChat} membersStr={membersStr} recipients={recipients} />
                    )
                })
            }

        </List>
    )

    return (
        <div square className={classes.chatsGridWrapper}>
            {chatsGrid}
        </div>
    )
}

function ChatComponent(props) {
    const { chatId } = useParams("chatId")
    const classes = useStyles();

    const [open, setOpen] = useState(false)

    const [hidden, setHidden] = useState(false)
    const [currentChat, setCurrentChat] = useState()
    const [allUsers, setAllUsers] = useState([])
    
    const [isGroupChat, setIsGroupChat] = useState(false)

    useEffect(() => {

        if (props.mode !== "GROUP") {
            firebase.getAllUsers({ role: "ALL" }, setAllUsers)
        }

    }, [])

    useEffect(() => {
        setCurrentChat()
        if (chatId) {
            console.log("Getting chat")
            firebase.getChat(chatId, setCurrentChat)
        }
    }, [chatId])

    useEffect(() => {
        if (currentChat && !currentChat.groupId) {
            setIsGroupChat(false)
        } else if (currentChat && currentChat.groupId) {
            setIsGroupChat(true)
        }
    }, [currentChat])

    function toggleHidden() {
        setHidden((prevState) => {
            return !prevState
        })
    }

    function goToProfile(uid) {
        props.history.push("/viewProfile/uid=" + uid)
    }

    // function for adding a new personal chat
    function handleAddPersonalChat(member) {
        let chatExists = doesChatExist(props.userChats, member.id)
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
        firebase.addNewGroupChat(props.group.id, props.group.members, chatName, props.group.name)
    }

    function handleButtonClick() {
        if (props.mode === "GROUP") {
            handleAddGroupChat()
        } else {
            setOpen(true)
        }
    }

    function openChat(chatID) {
        props.history.push("/chats/chatId=" + chatID)
    }

    function deleteChat() {
        console.log("Deleting the chat with ID: " + chatId)
        const consent = window.confirm("Are you sure you want to delete the chat?")
        if (consent) {
            firebase.deleteChat(chatId)
        }
    }

    //chat content component with routing
    function ChatContent() {
        if (props.type == "chat-info") {
            return (
                <div className="chat-wrapper">
                    <ChatHeader chat={currentChat} toggleHidden={toggleHidden} isGroupChat={isGroupChat} deleteChat={deleteChat} history={props.history}/>
                    <h3>Chat Info</h3>
                </div>
            )
        } else if (props.type == "chat-attachments") {
            return (
                <div className="chat-wrapper">
                    <ChatHeader chat={currentChat} toggleHidden={toggleHidden} isGroupChat={isGroupChat} deleteChat={deleteChat} history={props.history}/>
                    <h3>Chat Attachments</h3>
                    <ChatAttachments chatId={currentChat?.chatId}/>
                </div>
            )
        } else {
            return (
                <>
                    {currentChat ?
                        <Chat
                            toggleHidden={toggleHidden}
                            chat={currentChat}
                            mode={props.mode}
                            membersInfo={props.group?.membersInfo}
                            deleteChat={deleteChat}
                            isGroupChat={isGroupChat}
                        />
                        :
                        <h3>Select a chat in the sidebar</h3>
                    }
                </>
            )
        }
    }

    return (
        <div className={classes.outerWrapper}>

            <div className={classes.innerContainer} style={{ display: hidden ? "none" : "flex" }}>
                <Paper square>
                    <h1>Chat list</h1>
                </Paper>

                {open ?
                    <UsersListComponent
                        allUsers={allUsers}
                        owner={props.user}
                        handleAddPersonalChat={handleAddPersonalChat}
                        setOpen={setOpen}
                        goToProfile={goToProfile}
                    />
                    :
                    <ChatsListComponent
                        chats={props.mode !== "GROUP" ? props.userChats : []}
                        groupChats={props.mode === "GROUP" ? props.userGroupChats?.filter(groupChat => groupChat.groupId == props.group.id) : props.userGroupChats}
                        mode={props.mode}
                        goToProfile={goToProfile}
                        openChat={openChat}
                        setCurrentChat={setCurrentChat}
                        deleteChat={deleteChat}
                    />
                }
                <Paper square>
                    <center>
                        <Button onClick={handleButtonClick}>
                            Add new chat
                        </Button>
                    </center>
                </Paper>

            </div>

            <div className={classes.currentChat} style={{ width: hidden ? "100%" : "75%" }}>

                <ChatContent/>
                {/* {currentChat ?
                    <Chat
                        toggleHidden={toggleHidden}
                        chat={currentChat}
                        mode={props.mode}
                        membersInfo={props.group?.membersInfo}
                        deleteChat={deleteChat}
                    />
                    :
                    <h3>Select a chat in the sidebar</h3>
                } */}

            </div>
        </div>
    )
}



const mapStateToProps = state => {
    return {
        user: state.user,
        theme: state.theme,
        userChats: state.userChats,
        userGroupChats: state.userGroupChats
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
        setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatComponent));