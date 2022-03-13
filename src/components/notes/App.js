//<-----------------------NOTES PAGE COMPONENT----------------------->//
import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { Button, Dialog, IconButton, Accordion, AccordionSummary, Fab, AccordionDetails, Typography, Card, CardContent, AccordionActions, CardActions } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import firebase from "../../firebase/firebase"
import NoteDialog from "./noteDialog";


//card component to display a note shortcut (title and date created)
function NoteItem(props) {
    let dateStr = new Date(props.note.dateCreated).toDateString()

    //function for opening a note in dialog
    function handleOpenNote() {
        props.setOpen({ payload: { title: props.note.title, dateCreated: props.note.dateCreated, noteId: props.note.id }, mode: "WATCH" })
    }

    //function for deleting a note
    function handleDeleteNote() {
        firebase.deleteNote(props.note.id)
    }

    return (
        <Card >
            <CardContent>
                <h2>{props.note.title}</h2>
                <i>Date: {dateStr}</i>
            </CardContent>
            <CardActions>
                <Button size="small" color="secondary" onClick={handleDeleteNote}>Delete</Button>
                <Button size="small" onClick={handleOpenNote}>Open</Button>
            </CardActions>
        </Card>
    )
}

//note page
function NotesComponent(props) {
    const [notes, setNotes] = useState([])
    const [open, setOpen] = useState({ mode: null, payload: false })

    //useEffect to fetch all the workouts from the database
    useEffect(() => {
        //console.log(props.user.uid)
        firebase.getUserNoteThumbs(props.user.uid, setNotes)
        console.log("loading notes")


    }, [props.user.uid])

    console.log(notes)


    //list of notes component
    const noteList = notes.map((note, index) => {

        return (
            <NoteItem key={index} note={note} setOpen={setOpen} />
        )
    })

    return (
        <>
            <Fab color="primary" aria-label="add" style={{ position: "absolute", right: 20, bottom: 20 }} onClick={() => setOpen({ mode: "CREATE", payload: { title: "", date: Date.now() } })}>
                <AddIcon />
            </Fab>


            <div style={{ display: "flex", flexDirection: "column", width: "80%", marginLeft: "auto", marginRight: "auto", marginTop: 30 }}>
                {noteList}
            </div>

            {open.payload ? <NoteDialog open={open} setOpen={setOpen} /> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotesComponent);