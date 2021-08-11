import React, { useState, useEffect } from "react"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import firebase from "../firebase/firebase"
import { Button, CircularProgress, Container } from '@material-ui/core';


function doesChatExist(memberId){
    return new Promise((resolve, reject) => {
        
        firebase.fireDB.collection('chat-groups').where("memberIDs", "array-contains", firebase.getCurrentUserId())
            .get()
            .then(snapshot => {
                let res = false
                snapshot.forEach(doc => {
                    const ids = doc.get("memberIDs")
                    if(ids[0]===memberId || ids[1]===memberId){
                        res = true
                    }
                })
                resolve(res)
                
            })
            .catch(reason => {
                console.log('db.collection("users").get gets err, reason: ' + reason);
                reject(reason);
            });
    });
}

function DashboardPage() {
    const [users, loading, error] = useCollection(firebase.fireDB.collection("users"))
    const [owner, ownerLoading, ownerError] = useDocument(firebase.fireDB.collection("users").doc("SWbQIG1WKzVqrAHlyAtyODaqxlZ2"))

    useEffect(()=>{
        console.log(users)
    }, [users])

    useEffect(()=>{
        if(!ownerLoading){
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
                return(
                    <p>{user.name + " " + user.surname}</p>
                )
            })}
            <Button onClick={()=>{
                firebase.doesChatExist("gIq6JWDoH9dxLTpFeV0wHqy2tDy1").then(res => {
                    console.log(res)
                })
                }}>Update Chats</Button>
        </div>
    )
}

export default DashboardPage
