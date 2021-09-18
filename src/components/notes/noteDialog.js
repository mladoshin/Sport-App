//<-----------------------NOTE DIALOG FOR NOTE COMPONENT----------------------->//
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, AppBar, Toolbar, IconButton, Divider, Button, Grid, Card, Avatar, TextField } from '@material-ui/core'
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

import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

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

//transition for dialog window
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


//editor component
function Editor(props) {
    var data = props.data
    var setData = props.setData

    console.log("Data in editor: ")
    console.log(data)
    return (
        <>
            <div id="toolbar"></div>
            <CKEditor
                editor={DecoupledEditor}
                data={data}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);

                    const toolbarContainer = document.getElementById('toolbar');
                    console.log(toolbarContainer)
                    toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                    window.editor = editor;
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    if(!props.readOnly){
                        const data = editor.getData();
                        setData(data)
                        console.log({ event, editor, data });
                    }
                    
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </>
    )
}

//dialog component
function NoteDialog(props) {
    const classes = useStyles();
    //state for editor text content
    const [text, setText] = useState("")
    //state for note title
    const [title, setTitle] = useState(props.open.payload && props.open.payload.title)

    //useEffect to fetch the note's content and set the title state to props.open.payload.title
    useEffect(() => {
        //subscribe to note content listener
        if (props.open.mode == "WATCH") {
            firebase.getNote(firebase.getCurrentUserId(), props.open.payload.noteId, setText)
            setTitle(props.open.payload.title)
        }


    }, [props.open.payload])

    console.log(text)

    //function for closing the dialog
    function handleClose() {
        props.setOpen({ mode: "WATCH", payload: null })
    }

    //function for adding new note 
    function handleAddNote() {
        let newNote = {
            data: text,
            title: title,
            dateCreated: Date.now()
        }
        firebase.addNote(newNote)

    }

    //function which switches to editMode
    function handleSwithToEditMode(){
        props.setOpen({...props.open, mode: "EDIT"})
    }

    //function for updating the note
    function handleUpdateNote(){
        let updates = {
            title: title,
            data: text
        }
        firebase.updateNote(props.open.payload.noteId, updates)
    }

    //dynamic button component
    function ActionButton(){
        if(props.open.mode=="WATCH"){
            //if mode is "WATCH" then render button "EDIT"
            return(
                <Button autoFocus color="inherit" onClick={handleSwithToEditMode}>
                        Edit
                </Button>
            )
        }else if(props.open.mode=="CREATE"){
            //if mode is "CREATE" then render button "CREATE"
            return(
                <Button color="inherit" onClick={handleAddNote}>
                        Create
                </Button>
            )
        }else if(props.open.mode=="EDIT"){
            //if mode is "EDIT" then render button "SAVE"
            return(
                <Button color="inherit" onClick={handleUpdateNote}>
                        Save
                </Button>
            )
        }
    }

    return (
        <Dialog fullScreen open={props.open.payload ? true : false} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <TextField id="standard-basic" label="Enter a name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <ActionButton/>
                </Toolbar>
            </AppBar>
            <Editor data={text} setData={setText} />


        </Dialog>
    )
}

export default NoteDialog;