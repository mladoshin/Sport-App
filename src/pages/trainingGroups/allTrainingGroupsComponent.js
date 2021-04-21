import React, {useState, useEffect} from "react"
import { connect } from "react-redux"
import { Button, Grid, Paper } from "@material-ui/core";
import { withRouter, useParams } from "react-router-dom";
import firebase from "../../firebase/firebase"

function isUserInGroup(uid, groupMembers){
    let res = groupMembers.indexOf(uid)
    return res > -1 ? true : false
}
function ActionButton(props){

    function subscribeToTrainingGroup(){
        let member = {
            id: props.user.uid,
            name: props.user.displayName.split(" ")[0],
            surname: props.user.displayName.split(" ")[1],
            photoURL: props.user.photoURL,
            dateJoined: Date.now(),
            role: "SPORTSMAN"
        }

        firebase.addMembersToTrainingGroup(props.group.groupId, [member])
    }

    function handleApplyToTrainingGroup(){
        let text = window.prompt("Enter application text: ")
        let applicant = {
            name: props.user.displayName.split(" ")[0],
            surname: props.user.displayName.split(" ")[1],
            photoURL: props.user.photoURL,
            applicationDate: Date.now(),
            message: text
        }
        firebase.applyToTrainingGroup(props.group.groupId, props.user.uid, applicant)
    }

    function unsubscribeFromTrainingGroup(){
        let memberId = props.user.uid
        firebase.removeMemberFromTrainingGroup(props.group.groupId, [memberId])
    }

    if(props.user.claims.role==="SPORTSMAN" && !isUserInGroup(props.user.uid, props.group.members)){
        if(props.group.isPrivate){
            return(
                <Button style={{backgroundColor: "green"}} onClick={handleApplyToTrainingGroup}>Apply</Button>
            )
        }else{
            return(
                <Button style={{backgroundColor: "green"}} onClick={subscribeToTrainingGroup}>subscribe</Button>
            )
        }
        
    }else if(props.user.claims.role==="SPORTSMAN" && isUserInGroup(props.user.uid, props.group.members)){
        return(
            <Button color="secondary" onClick={unsubscribeFromTrainingGroup}>Unsubscribe</Button>
        )
    }else{
        return null
    }
}

function GroupGrid(props) {
    console.log(props.user)

    function handleOpenGroup(groupId){
        if(props.user.claims.role == "COACH"){
            props.goToPage("/coachApp/coachId="+props.user.uid+"/training-groups/groupId="+groupId)
        }else if(props.user.claims.role == "SPORTSMAN"){
            props.goToPage("/sportsmanApp/userId="+props.user.uid+"/training-groups/groupId="+groupId)
        }
    }

    const groupsItems = props.groups.map((group, index) => {
        return (
            <Grid item xs={6} lg={2} key={index}>
                <Paper style={{ height: "100%", padding: 10 }}>
                    <h1 style={{margin: 0, textAlign: "center"}}>{group.name}</h1>
                    <p>Status: {group.isPrivate ? "Private" : "Public"}</p>
                    <p>{group.groupId}</p>
                    <p>Members: {group.members ? group.members.length : 0}</p>
                    <Button onClick={()=>handleOpenGroup(group.groupId)}>Open</Button>
                    <ActionButton group={group} user={props.user}/>
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
