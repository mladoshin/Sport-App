import React, { useState, useEffect } from "react"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import firebase from "../firebase/firebase"
import { Button, CircularProgress, Container } from '@material-ui/core';


function isAlreadySubscribed(groupId, uid) {
    return new Promise((resolve, reject) => {
        firebase.fireDB.collection("training-groups").doc(groupId).get().then(snap => {
            const members = snap.data().members
            const ownerId = snap.data().owner

            //reject if the user is group's Owner
            if (ownerId === uid) {
                reject({status: "error", message: "The user is owner!"})
            }

            if (members.indexOf(uid) !== -1) {
                resolve({status: "success", res: true})
            } else {
                resolve({status: "success", res: false})
            }


        }).catch(err => reject(err))
    })
}

function isGroupOwner(groupId, uid){
    return new Promise((resolve, reject) => {
        firebase.fireDB.collection("training-groups").doc(groupId).get().then(snap => {
            const ownerId = snap.data().owner
            
            if(uid===ownerId){
                resolve(true)
            }else{
                resolve(false)
            }

        }).catch(err => reject(err))
    })
}

function DashboardPage() {
    const [users, loading, error] = useCollection(firebase.fireDB.collection("users"))
    const [owner, ownerLoading, ownerError] = useDocument(firebase.fireDB.collection("users").doc("SWbQIG1WKzVqrAHlyAtyODaqxlZ2"))

    useEffect(() => {
        console.log(users)
    }, [users])

    useEffect(() => {
        if (!ownerLoading) {
            console.log("owner")
            console.log(owner.data())
        }

    }, [owner])

    if (loading) {
        return (
            <Container>
                <center>
                    <CircularProgress />
                </center>
            </Container>
        )
    }

    if (error) {
        return (
            <h1>Error!</h1>
        )
    }

    return (
        <div>
            <h1>Dashboard Page</h1>
            {users?.docs.map((doc, index) => {
                const user = doc.data()
                return (
                    <p>{user.name + " " + user.surname}</p>
                )
            })}
            <Button onClick={() => {
                const groupId = "PgTBRPB3Xk4kXWopxpsS"
                const memberId = "gIq6JWDoH9dxLTpFeV0wHqy2tDy1"
                isAlreadySubscribed(groupId, memberId).then(res => console.log(res)).catch(console.log)
                isGroupOwner(groupId, memberId).then(res => console.log("owner: "+res))
            }}>Update Chats</Button>
                
        </div>
    )
}

export default DashboardPage
