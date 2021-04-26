import React, {useState, useEffect, useRef} from "react"
import { ListItem, Paper, Avatar } from "@material-ui/core"
import firebase from '../../firebase/firebase';
import { Suspense } from "react";

function ChatItem(props) {
    const chat = props.chat
    const membersStr = props.membersStr
    const setCurrentChat = props.setCurrentChat
    const [userPhotoURL, setUserPhotoURL] = useState("")
    const [userName, setUserName] = useState("")
    const [uptodateChat, setUptodateChat] = useState(props.chat)

    useEffect(()=>{
        if (props.mode !== "GROUP"){
            let memberId = chat.members[0].uid
            firebase.getUserInfoById(memberId).then(member => {
                setUserPhotoURL(member.photoURL)
                setUserName(member.name + " " + member.surname)
                let members = [{...props.chat.members[0], photoURL: member.photoURL, name: member.name, surname: member.surname}]

                setUptodateChat({...props.chat, members: members})
            })
        }
        
        
    }, [props.chat])

    return (
        <ListItem button style={{ padding: 5}}>
            
            <Paper style={{ width: "100%", height: "60px", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={() => setCurrentChat(uptodateChat)}>
                <Avatar src={userPhotoURL} />
                <div>
                    <h4 style={{ display: "inline", margin: 0 }}>{props.mode !== "GROUP" ? userName : props.chat.members.join(", ")}</h4>
                    <p>{chat.lastMessage}</p>
                </div>

            </Paper>
            
        </ListItem>
    )
}
export default ChatItem