//<-----------------------WORKOUT BUILDER COMPONENT----------------------->//
import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { Button, Dialog, IconButton, Grid, Paper, Fab, AccordionDetails, Typography, Card, CardContent, AccordionActions } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import firebase from "../../firebase/firebase"
import { withRouter, useParams } from "react-router-dom";

import GroupDialog from "./trainingGroupDialog"
import AllTrainingGroupsComponent from "./allTrainingGroupsComponent"

function GroupGrid(props) {
    console.log(props.user)

    function handleOpenGroup(groupId){
        if(props.user.role == "COACH"){
            props.goToPage("/coachApp/coachId="+props.user.uid+"/training-groups/groupId="+groupId)
        }else if(props.user.role == "SPORTSMAN"){
            props.goToPage("/sportsmanApp/userId="+props.user.uid+"/training-groups/groupId="+groupId)
        }
    }

    const groupsItems = props.groups.map((group, index) => {
        return (
            <Grid item xs={6} lg={2} style={{}}>
                <Paper style={{ height: "100%", padding: 10 }}>
                    <h1 style={{margin: 0, textAlign: "center"}}>{group.name}</h1>
                    <p>Status: {group.isPrivate ? "Private" : "Public"}</p>
                    <p>{group.groupId}</p>
                    <p>Members: {group.members ? group.members.length : 0}</p>
                    <Button onClick={()=>handleOpenGroup(group.groupId)}>Open</Button>
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

//main workout builder component
function TrainingGroupsComponent(props) {
    //state for all workouts
    const [groups, setGroups] = useState([])
    const [allPublicGroups, setAllPublicGroups] = useState([])
    
    //dialog state
    const [open, setOpen] = useState({ mode: null, payload: false })

    console.log(groups)

    //fetch all groups in this useEffect
    useEffect(() => {
        console.log(props.user)
        
        //fetch all the groups from the database
        if(props.user.claims && props.user.claims.role == "COACH"){
            return firebase.getOwnerTrainingGroups(props.user.uid, setGroups)
        }else if(props.user.claims && props.user.claims.role == "SPORTSMAN"){
            return firebase.getUserTrainingGroups(props.user.uid, setGroups)
        }
        
        //firebase.getWorkouts(props.user.uid, date, setGroups)
    }, [props.user.uid])

    //function for adding a a new groups
    function handleOpenGroupDialog() {
        if (props.user.claims.role == "COACH") {
            setOpen({ payload: {}, mode: "CREATE" })
        }

    }

    return (
        <>
            {props.type == "COACH" ?
                <Fab color="primary" aria-label="add" style={{ position: "absolute", right: 20, bottom: 20 }} onClick={() => handleOpenGroupDialog()}>
                    <AddIcon />
                </Fab>
                :
                null
            }


            <h1>My training groups:</h1>
            <GroupGrid groups={groups} goToPage={props.history.push} user={{role: props.user.claims && props.user.claims.role, uid: props.user.uid}}/>

            <br />
            
            <AllTrainingGroupsComponent/>

            {open.payload ? <GroupDialog open={open} setOpen={setOpen} uid={props.user.uid}/> : null}
        </>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrainingGroupsComponent));