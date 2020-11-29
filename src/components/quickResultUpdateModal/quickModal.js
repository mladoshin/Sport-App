import React, { useState } from "react"
import { FormControl, InputAdornment, TextField, DialogActions, Button } from '@material-ui/core'
import DialogComponent from "../DialogComponent/dialog";
import { makeStyles } from '@material-ui/core/styles';
import firebase from "../../firebase/firebase"

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: "30px 0px 0px 0px"
    },
    gridItem: {
        padding: "1em"
    },
    upcomingDeadlinesCard: {
        height: 300,
        padding: 20
    },
    card: {
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    chartCard: {
        height: 400,
        padding: 20,
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    card1: {
        minHeight: 300,
        [theme.breakpoints.up("md")]: {
            height: "30vh"
        }
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
        //padding: "20px 30px 0px 30px"
        display: "flex",
        flexDirection: "row"
    },
    DialogActions: {
        //padding: "0px 30px 20px 30px"
    },
    updateBtn: {
        marginLeft: 15
    }

}));

function QuickModal(props) {

    const setOpenQuickModal = props.setOpenQuickModal
    const openQuickModal = props.openQuickModal
    const [newCurrentValue, setNewCurrentValue] = useState(openQuickModal.currentValue)
    const [newCurrentRepsValue, setNewCurrentRepsValue] = useState(openQuickModal.currentRepsValue)

    const classes = useStyles()
    console.log(openQuickModal)

    {/*header for the Modal*/ }
    var header = "Quick result update for " + '"' + openQuickModal.name + '"'

    {/*###header for the Modal###*/ }

    const handleBtnClick = (type) => {
        if (type === "CLOSE") {
            setOpenQuickModal(false)
        } else if (type === "UPDATE") {
            handleResultUpdate(newCurrentValue)
        }
    }

    function handleResultUpdate(result) {
        if (result >= Math.min(openQuickModal.startValue, openQuickModal.targetValue) && result <= Math.max(openQuickModal.targetValue, openQuickModal.startValue)) {
            firebase.quickResultUpdate(result, newCurrentRepsValue, openQuickModal.id)
        } else {
            alert("Current value should be in the valid range!")
        }
    }

    const form = (
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
            {newCurrentRepsValue ?
                <FormControl className={classes.formControl}>
                    <TextField
                        id="outlined-current_reps_value"
                        label="Reps"
                        variant="outlined"
                        value={newCurrentRepsValue ? newCurrentRepsValue : ""}
                        onChange={(e) => setNewCurrentRepsValue(e.target.value)}
                        className={classes.textInput}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">reps</InputAdornment>,
                        }}
                    />
                </FormControl>
                : null}
        </div>
    )

    return (
        <DialogComponent header={header} setOpenAddModal={setOpenQuickModal} openAddModal={openQuickModal ? true : false} maxWidth="xs">

            {form}

            {/*   Dialog Actions    */}
            <DialogActions className={classes.DialogActions}>
                <div>
                    <Button variant="outlined" color="primary" onClick={() => handleBtnClick("CLOSE")}>Cancel</Button>
                    <Button variant="contained" color="primary" className={classes.updateBtn} onClick={() => handleBtnClick("UPDATE")}>Update</Button>
                </div>
            </DialogActions>

        </DialogComponent>
    )
}

export default QuickModal