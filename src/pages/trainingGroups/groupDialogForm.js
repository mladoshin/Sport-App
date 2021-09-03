import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Paper, CssBaseline, ListItemSecondaryAction, FormControl, MenuItem, ListItemText, Checkbox, InputLabel, Input, Select, Dialog, AppBar, Toolbar, IconButton, Switch, Button, Grid, Card, Avatar, TextField, List, ListItem, ListItemAvatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

//dialog form
function DialogForm(props) {
    console.log(props)
    const classes = useStyles();
    const [email, setEmail] = useState("")
    //const [selectedMemberIDs, setSelectedMemberIDs] = useState(props.payload.members ? props.payload.members : [])

    const selectedMemberIDs = props.memberIds
    const setSelectedMemberIDs = props.setMemberIds

    const [members, setMembers] = useState([])
    const [requests, setRequests] = useState([])
    const allAthletes = props.allAthletes

    console.log(members)

    useEffect(() => {
        return firebase.getAllMembersInTrainingGroup(props.payload.id, setMembers)
    }, [])

    useEffect(()=>{
        return firebase.getAllApplicantsFromTrainingGroup(props.payload.id, setRequests)
    }, [])


    console.log(props.payload)

    function handleChangeMultiple(event) {
        setSelectedMemberIDs(event.target.value);
    };

    function injectContent(selected) {
        let val = []
        selected.map((item, index) => {
            allAthletes.find((athlete, i) => {
                if (athlete.id === item) {
                    val.push(athlete.name)
                    return true
                }

            })
        })
        return val.join(",")
    }

    function handleAddUser(){
        console.log(props)
        const memberId = email
        firebase.addMembersToTrainingGroup([memberId], props.payload.id)
        // firebase.getUserByEmail(email).then(user => {
        //     console.log(user)
        //     const memberId = user.data.uid
        //     console.log("New member with id: "+memberId)
        //     //firebase.addMembersToTrainingGroup([memberId], props.open.payload.id)
        // }).catch(err => console.log(err))
        
    }

    function handleRemoveUser(uid){
        alert("Deleting user with id: "+uid)
        //firebase.removeMemberFromTrainingGroup(props.payload.id, [uid])
        firebase.removeMembersFromTrainingGroup([uid], props.payload.id)
    }

    function handleAcceptRequest(applicant){
        let role = "SPORTSMAN"
        let newMember = {
            id: applicant.uid,
            name: applicant.name,
            surname: applicant.surname,
            photoURL: applicant.photoURL,
            role: role,
            dateJoined: Date.now()
        }
        console.log(newMember)
        
        firebase.addMembersToTrainingGroup(props.payload.id, [newMember])
        firebase.removeApplicantFromTrainingGroup(props.payload.id, newMember.id)
    }

    function handleRejectRequest(applicant){
        firebase.removeApplicantFromTrainingGroup(props.payload.id, applicant.uid)
    }

    return (
        <div>
            <Switch
                checked={props.isPrivate}
                onChange={props.handleChange}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <hr />

            <div>
                <h2>Add members</h2>

                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={selectedMemberIDs}
                        onChange={handleChangeMultiple}
                        input={<Input />}
                        renderValue={(selected) => injectContent(selected)}
                        MenuProps={MenuProps}
                        autoFocus={false}
                    >
                        {allAthletes.map((user, index) => (
                            <MenuItem key={user.id} value={user.id}>
                                <Checkbox checked={selectedMemberIDs.indexOf(user.id) > -1} />
                                <Avatar src={user.photoURL} style={{ marginRight: 10 }} />
                                <ListItemText primary={user.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div>
                    <TextField id="standard-basic" label="Enter a name" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={handleAddUser}>Add User</Button>
                </div>
                <div>
                    <h1>Member list</h1>
                    <List>
                        {members.map((member, i) => {

                            return (
                                <ListItem style={{ padding: 10, borderBottom: "1px solid black" }}>
                                    <ListItemAvatar>
                                        <Avatar src={member.photoURL}/>
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <h3>User Name: {member.name + " " +member.surname}</h3>
                                        <p>Role: {member.role}</p>
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" color="secondary" aria-label="delete" onClick={()=>handleRemoveUser(member.uid)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>

                </div>

                <div>
                    <h1>Requests list</h1>
                    <List>
                        {requests.map((applicant, i) => {

                            return (
                                <ListItem style={{ padding: 10, borderBottom: "1px solid black" }} key={i}>
                                    <ListItemAvatar>
                                        <Avatar src={applicant.photoURL}/>
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <h3>User Name: {applicant.name + " " +applicant.surname}</h3>
                                        
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <Button color="secondary" onClick={()=>handleRejectRequest(applicant)}>Reject</Button>
                                        <Button onClick={()=>handleAcceptRequest(applicant)}>Accept</Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>

                </div>


            </div>
            <br />

        </div>
    )
}

export default DialogForm;