import React, {useState, useEffect} from "react"
import { connect } from "react-redux"
import { Button, Grid, Paper } from "@material-ui/core";
import { withRouter, useParams } from "react-router-dom";
import firebase from "../../firebase/firebase"

function isUserInGroup(uid, groupMembers){
    let res = groupMembers.indexOf(uid)
    return res > -1 ? true : false
}

function ActionButton({group, isOwner, user}){

    function subscribeToTrainingGroup(){
        let member = {
            id: user.uid,
            name: user.displayName.split(" ")[0],
            surname: user.displayName.split(" ")[1],
            photoURL: user.photoURL,
            dateJoined: Date.now(),
            role: "SPORTSMAN"
        }

        firebase.addMembersToTrainingGroup(group.groupId, [member])
    }

    function handleApplyToTrainingGroup(){
        let text = window.prompt("Enter application text: ")
        let applicant = {
            name: user.displayName.split(" ")[0],
            surname: user.displayName.split(" ")[1],
            photoURL: user.photoURL,
            applicationDate: Date.now(),
            message: text
        }
        firebase.applyToTrainingGroup(group.groupId, user.uid, applicant)
    }

    function unsubscribeFromTrainingGroup(){
        let memberId = user.uid
        firebase.removeMemberFromTrainingGroup(group.groupId, [memberId])
    }


    if(!isUserInGroup(user.uid, group.members)){
        if(group.isPrivate){
            return(
                <Button style={{backgroundColor: "green"}} onClick={handleApplyToTrainingGroup}>Apply</Button>
            )
        }else{
            return(
                <Button style={{backgroundColor: "green"}} onClick={subscribeToTrainingGroup}>subscribe</Button>
            )
        }
        
    }else if(isUserInGroup(user.uid, group.members) && !isOwner){
        return(
            <Button color="secondary" onClick={unsubscribeFromTrainingGroup}>Unsubscribe</Button>
        )
    }else if(isOwner){
        return(
            <i>It is your group</i>
        )
    }else{
        return null
    }
}

function GroupGrid(props) {
    console.log(props.user)

    function handleOpenGroup(groupId){
        props.goToPage("/training-groups/groupId="+groupId)

    }

    const isOwner = (group) => {
        //console.log(props.user.uid)
        //console.log(props.group.owner)
        if(props.user.uid===group.owner){
            return true
        }
        return false
    }

    const groupsItems = props.groups.map((group, index) => {
        
        const owner = isOwner(group)
        console.log(owner)
        return (
            <Grid item xs={6} lg={2} key={index}>
                <Paper style={{ height: "100%", padding: 10 }}>
                    <h1 style={{margin: 0, textAlign: "center"}}>{group.name}</h1>
                    <p>Status: {group.isPrivate ? "Private" : "Public"}</p>
                    <p>{group.groupId}</p>
                    <p>Members: {group.members ? group.members.length : 0}</p>
                    <Button onClick={()=>handleOpenGroup(group.groupId)}>Open</Button>
                    <ActionButton group={group} user={props.user} isOwner={owner}/>
                </Paper>
            </Grid>
        )
    })

    return (
        <Grid container spacing={2}>
            {groupsItems}
        </Grid>
    )
}

function AllTrainingGroupsComponent(props) {
    const [allPublicGroups, setAllPublicGroups] = useState([])

    useEffect(()=>{
        return firebase.getAllPublicTrainingGroups(setAllPublicGroups)
    }, [])



    return (
        <div>
            <h1>All training groups:</h1>
            <GroupGrid groups={allPublicGroups} user={props.user} goToPage={props.history.push}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AllTrainingGroupsComponent));
