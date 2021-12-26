import {useState, useEffect} from "react"
import { Paper, Button, Grid, IconButton } from "@material-ui/core"
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import CustomAvatar from "../common/avatar"
import { withRouter } from "react-router";
import firebase from "../../firebase/firebase"
import getRecipient from "../../utils/getRecipient";
import ChatInfoMenu from "./chatInfoMenu";

function ChatTitle({ chat, isGroupChat, history }) {
    const [chatName, setChatName] = useState("")

    function handleGroupClick() {
        history.push("/training-groups/groupId=" + chat.groupId)
    }

    useEffect(() => {
        if (chat && !isGroupChat) {
            let recipients = getRecipient(chat.membersInfo, firebase.getCurrentUserId()).map(recipient => recipient.name + " " + recipient.surname)
            setChatName(recipients.join(","))

        } else if (chat && isGroupChat) {
            let name = " (" + chat.title + ")"
            setChatName(name)
        }

    }, [chat, isGroupChat])

    return (
        <div>
            {isGroupChat ?
                <h2 className="chat-title">
                    <b onClick={handleGroupClick}>{chat.groupName}</b>
                    {chatName}
                </h2>
                :
                <h2 className="chat-title">{chatName}</h2>
            }
        </div>


    )
}

function ChatHeader({ chat, toggleHidden, isGroupChat, deleteChat, history }) {
    const [openMoreMenu, setOpenMoreMenu] = useState(null)

    function handleOpenMoreMenu(e) {
        setOpenMoreMenu(e.target)
    }

    function handleCloseMoreMenu(e) {
        setOpenMoreMenu(null)
    }

    console.log(chat)
    return (
        <div className="chatHeader">
            <Paper square style={{ display: "flex", flexDirection: "row", alignItems: "center", height: 49 }}>
                <Button size="small" onClick={() => toggleHidden()}>Hide list</Button>

                {/* <h2 style={{ margin: 0, display: "inline", marginLeft: 30, marginRight: 30 }}>{chatName}</h2> */}
                <ChatTitle chat={chat} isGroupChat={isGroupChat} history={history} />

                {isGroupChat &&
                    <Grid container spacing={0} style={{ width: 200, height: 32, overflow: "hidden" }}>
                        {chat?.membersInfo?.map((member, index) => {

                            return (
                                <Grid item>
                                    <CustomAvatar user={member} disableRipple={true} style={{ border: "2px solid grey" }} btnStyle={{ padding: 0 }} />
                                </Grid>
                            )
                        })}
                    </Grid>
                }

                <IconButton style={{ position: "absolute", right: 10, padding: 4 }} onClick={handleOpenMoreMenu} id="chat-more-menu-btn">
                    <MoreVertRoundedIcon />
                </IconButton>

                <ChatInfoMenu anchorEl={openMoreMenu} handleClose={handleCloseMoreMenu} deleteChat={deleteChat} chatId={chat?.chatId}/>

            </Paper>
        </div>
    )
}

export default withRouter(ChatHeader)
