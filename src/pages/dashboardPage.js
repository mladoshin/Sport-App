import React, { useState, useEffect } from "react"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import firebase from "../firebase/firebase"
import { Button, CircularProgress, Container } from '@material-ui/core';


function getUsersDataByIds(userIds){
    let promises = []
    userIds.forEach(id => {
        const promise = new Promise((resolve, reject) => {
            firebase.fireDB.collection("users").doc(id).get().then(snapshot => {
                const data = snapshot.data()
                data.uid = snapshot.id
                resolve(data)
            }).catch(err => reject(err))
        })
        promises.push(promise)
    })

    return Promise.all(promises)
}

function prepareMembersData(data, ownerId){
    data.forEach(member => {
        let role = "member"
        if(member.uid === ownerId){
            role = "owner"
        }

        const memberData = {
            name: member.name,
            surname: member.surname,
            photoURL: member.photoURL,
            role: role,
            uid: member.uid
        }

        //add the member to the subcollection
        console.log(memberData)
    })
}

function createTrainingGroup(memberIds, ownerId){
    getUsersDataByIds([...memberIds, ownerId]).then(res => {
        prepareMembersData(res, ownerId)
    })
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
                const memberIds = ["eEMwFXdbbHQoSl5I9dDNsAtFhKv2", "gIq6JWDoH9dxLTpFeV0wHqy2tDy1", "2CHacBYdEKUcg0IDTWCKNxFj9wT2"]
                const ownerId = "SWbQIG1WKzVqrAHlyAtyODaqxlZ2"
                createTrainingGroup(memberIds, ownerId)
                }}>Update Chats</Button>
        </div>
    )
}

export default DashboardPage
