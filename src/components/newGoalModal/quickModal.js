import React, { useState } from "react"
import { Dialog, Typography, IconButton, Divider, DialogActions, Button, FormControl, TextField, InputAdornment } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase"
import { useParams } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%"
    },
    button: {
        marginRight: theme.spacing(1)
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    formControl: {
        width: "100%"
    },
    textInput: {
        margin: theme.spacing(1)
    },
    DialogHeader: {
        display: "flex", 
        flexDirection: "row", 
        padding: "5px 10px 5px 20px", 
        alignItems: "center"
    },
    DialogHeaderText: {
        flexGrow: 1, 
        lineHeight: "48px"
    },
    FormContainer: {
        padding: "20px 30px 0px 30px"
    },
    DialogActions: {
        padding: "0px 30px 20px 30px"
    }
}));

function QuickModal(props) {
    const setOpenQuickModal = props.setOpenQuickModal
    const openQuickModal = props.openQuickModal
    const [newCurrentValue, setNewCurrentValue] = useState(openQuickModal.currentValue)
    const classes = useStyles()

    //console.log(openQuickModal)


    function handleCloseModal(setOpenAddModal) {
        setOpenQuickModal(false)
    }

    function handleResultUpdate(result, goal){
        console.log("Goal id: "+goal.id)
        if(result >= Math.min(goal.startValue, goal.targetValue)  && result <= Math.max(goal.targetValue, goal.startValue)){
            firebase.quickResultUpdate(result, goal.currentRepsValue, goal.id)   
        }else{
            alert("Current value should be in the valid range!")
        }
        
    }
    
    return (
        <Dialog onClose={() => handleCloseModal(setOpenQuickModal)} open={openQuickModal.currentValue ? true : false} maxWidth="xs">

            {/*     Dialog Header      */}
            <div className={classes.DialogHeader}>
                <Typography variant="h4" className={classes.DialogHeaderText}>Update your current result</Typography>

                <IconButton aria-label="close" onClick={() => handleCloseModal(setOpenQuickModal)} style={{}}>
                    <CloseIcon />
                </IconButton>
            </div>

            <Divider />

            {/*     Dialog Form      */}
            <div className={classes.FormContainer}>
                <FormControl className={classes.formControl}>
                    <TextField 
                    id="outlined-current_value" 
                    label="Current Value" 
                    variant="outlined" 
                    value={newCurrentValue ? newCurrentValue : ""} 
                    onChange={(e) => setNewCurrentValue(e.target.value)} 
                    className={classes.textInput} 
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{openQuickModal.units}</InputAdornment>,
                    }}
                    />
                </FormControl>
            </div>

            {/*     Dialog action section with buttons      */}
            <DialogActions className={classes.DialogActions}>
                    <Button variant="outlined" color="primary" onClick={()=>handleCloseModal(setOpenQuickModal)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={()=>handleResultUpdate(newCurrentValue, openQuickModal)}>Update</Button>
            </DialogActions>


        </Dialog>
    )
}

export default QuickModal;