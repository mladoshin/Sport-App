import React, { useState, useEffect } from "react"
import firebase from "../../../firebase/firebase"
//import ChatApp from "../../chat/chatApp"
import ChatApp from "../../../components/chat/chatApp"
import { useCollectionOnce } from "react-firebase-hooks/firestore"

function getTrainingGroupMembers(groupId){
    return new Promise((resolve, reject) => {
        firebase.fireDB.collection("training-groups").doc(groupId).collection("members")
        .get()
        .then(snapshot => {
            let members = []
            snapshot?.docs.forEach(doc => {
                members.push({...doc.data(), uid: doc.id})
            })
            resolve(members)
        }).catch(err => {
            console.log(err)
            reject()
        })
    })
}

function ChatTab(props) {
    const [members, setMembers] = useState([])
    const chat = null

    useEffect(() => {
        //console.log(props.group)
        //firebase.getGroupChatsForTrainingGroup(, setChats)
        getTrainingGroupMembers(props.group.id).then(res => setMembers(res))
    }, [])

    return (
        <div>
            <h1>Chat Page...</h1>
            <ChatApp group={{ ...props.group, membersInfo: members }} mode="GROUP" />
        </div>
    )
}

export default ChatTab;