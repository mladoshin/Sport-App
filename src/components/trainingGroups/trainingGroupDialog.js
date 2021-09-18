//<-----------------------TRAINING GROUP DIALOG FOR TRAINING GROUP COMPONENT----------------------->//
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Paper, CssBaseline, Tooltip, FormControl, MenuItem, ListItemText, Checkbox, InputLabel, Input, Select, Dialog, AppBar, Toolbar, IconButton, Switch, Button, Grid, Card, Avatar, TextField } from '@material-ui/core'
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

import DialogForm from "./groupDialogForm"

//styles
const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

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

//transition for dialog window
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


//dialog component
function GroupDialog(props) {
    const classes = useStyles();
    //state for editor text content
    const [text, setText] = useState("")
    const [isPrivate, setIsprivate] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState([])
    const [allAthletes, setAllAthletes] = useState([])
    

        
    //state for note title
    const [title, setTitle] = useState("")

    useEffect(() => {
        firebase.getAllUsers({ role: "SPORTSMAN" }, setAllAthletes)
        console.log(props.open)
        if(props.open.mode === "EDIT"){
            setIsprivate(props.open.payload.isPrivate)
            setTitle(props.open.payload.name)
            setSelectedMembers(props.open.payload.members)
        }
    }, [])


    //function for closing the dialog
    function handleClose() {
        props.setOpen({ mode: "WATCH", payload: null })
    }

    //function for adding new note 
    function handleAddGroupd() {
        
        //firebase.addTrainingGroup(newGroup, props.uid, membersId, selectedMembers)
        firebase.createNewTrainingGroup(selectedMembers, title, isPrivate)
        handleClose()

    }

    //function which switches to editMode
    function handleSwithToEditMode() {
        props.setOpen({ ...props.open, mode: "EDIT" })
    }

    function handleUpdateGroup(){
        let updates = {}

        if(props.open.payload.name !== title){
            console.log("The title needs to be updated!")
            updates.name = title
        }

        if(props.open.payload.isPrivate !== isPrivate){
            console.log("isPrivate needs to be updated!")
            updates.isPrivate = isPrivate
        }

        if(updates.name || updates.isPrivate !== undefined){
            console.log("updates:")
            console.log(updates)
            firebase.updateTrainingGroupInfo(props.open.payload.id, updates)
        }


    }

    //dynamic button component
    function ActionButton() {
        if (props.open.mode == "WATCH") {
            //if mode is "WATCH" then render button "EDIT"
            return (
                <Button autoFocus color="inherit" onClick={handleSwithToEditMode}>
                    Edit
                </Button>
            )
        } else if (props.open.mode == "CREATE") {
            //if mode is "CREATE" then render button "CREATE"
            return (
                <Button color="inherit" onClick={handleAddGroupd}>
                    Create
                </Button>
            )
        } else if (props.open.mode == "EDIT") {
            //if mode is "EDIT" then render button "SAVE"
            return (
                <Button color="inherit" onClick={handleUpdateGroup}>
                    Save
                </Button>
            )
        }
    }

    //form for dialog
    

    function handleChange(e) {
        setIsprivate(e.target.checked)
    }

    return (
        <Dialog fullScreen open={props.open.payload ? true : false} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <TextField label="Enter a name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <ActionButton />
                </Toolbar>
            </AppBar>
            <Container>
                <h1>Dialog Content</h1>
                <DialogForm isPrivate={isPrivate} handleChange={handleChange} allAthletes={allAthletes} payload={props.open.payload} memberIds={selectedMembers} setMemberIds={setSelectedMembers}/>
            </Container>
            

        </Dialog>
    )
}

export default GroupDialog;