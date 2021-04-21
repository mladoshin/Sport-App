import React, { useEffect, useState } from "react"
import { withRouter, useParams } from "react-router-dom";
import { connect } from "react-redux"
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Dialog, Typography, Checkbox, ListItemText, ListItemSecondaryAction, ListItem, List, ListItemIcon, Card } from "@material-ui/core"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import WorkoutComponent from "../workoutBuilder/App"
import Editor from "../notes/editor";

import firebase from "../../firebase/firebase"


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function WorkoutPlanCalendarDialog(props) {
    const date = new Date(props.open.payload.dateStr).toLocaleString('default', { dateStyle: "full" })
    const [title, setTitle] = useState(props.open.payload.title)
    const [data, setData] = useState(null)
    const [content, setContent] = useState(null)


    console.log(props.open)

    useEffect(() => {
        //fetch the workout data
        console.log("In editing mode!")
        firebase.getWorkoutContent(props.group, props.planId, props.open.payload.dateStr, setContent)

    }, [props.open.payload])

    useEffect(() => {
        if (content) {
            try{
                setData(content[0].data)
            }catch(err){
                console.log(err)
            }
            
        }
    }, [content])

    const handleClose = () => {
        props.setOpen({ ...props.open, payload: null })
    };

    //console.log(data)

    function handleDeleteWorkout() {

    }

    function handleUpdateWorkout() {
        let updates = { data: data }

        if (props.open.payload.title !== title) {
            updates.title = title
        }

        console.log("Updating!")
        console.log(updates)

        if (content) {
            console.log(content[0])
            firebase.updateWorkoutContent(props.group, props.planId, content[0].workoutId, updates)
        }

    }

    function handleCreateWorkout() {
        let workout = {
            title: title,
            data: data,
            dateCreated: Date.now(),
            dateStr: props.open.payload.dateStr
        }
        //console.log(props.planId)

        firebase.createDayWorkout(props.group, props.planId, workout)
    }

    function WorkoutActionButtonGroup() {
        if (props.open.mode === "VIEW") {
            return(
                <Button color="secondary" onClick={handleClose}>
                        Close
                </Button>
            )
        } else if (props.open.mode === "CREATE") {
            return (
                <>
                    <Button color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>

                    <Button onClick={handleCreateWorkout}>Create</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button color="secondary" onClick={handleDeleteWorkout}>
                        Delete
                        </Button>

                    <Button onClick={handleUpdateWorkout}>Save</Button>
                </>
            )
        }
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.open.payload ? true : false} maxWidth="lg" fullWidth={true} style={{ minHeight: 900 }} pap>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.open.mode === "VIEW" ? <h2>{title}</h2> : <TextField variant="outlined" label="Workout Name" style={{ display: "block" }} value={title} onChange={(e) => setTitle(e.target.value)} />}
                {props.open ? date : ""}
                <div>
                    <Button onClick={props.previousDay}>Prev day</Button>
                    <Button onClick={props.nextDay}>Next day</Button>
                </div>
            </DialogTitle>

            <DialogContent dividers>
                <Editor readOnly={props.open.mode === "VIEW"} data={data} setData={setData} />
            </DialogContent>

            <DialogActions>

                {/*<ActionButton mode={props.open.mode} />*/}
                <WorkoutActionButtonGroup/>


            </DialogActions>
        </Dialog>
    )
}

export default WorkoutPlanCalendarDialog;