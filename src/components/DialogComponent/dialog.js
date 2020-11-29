import React, { useState } from "react"
import { Dialog, Typography, IconButton, Divider, DialogActions, Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from "@material-ui/core/styles";
import FormContext from "../newGoalModal/context/formContext"

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
    formDialog: {

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
        padding: "20px 30px 20px 30px"
    },
    DialogActions: {
        padding: "0px 30px 20px 30px"
    }
}));

function DialogComponent(props) {
    const header = props.header
    const setOpenAddModal = props.setOpenAddModal
    const openAddModal = props.openAddModal
    const classes = useStyles()

    function handleCloseModal(setOpenAddModal) {
        setOpenAddModal(false)
        if(props.clearState){
            clearState()
        }
    }

    function clearState() {
        props.setActiveStep(0)
        props.data.setGoalName("")
        props.data.setCategory("")
        props.data.setType("")
        props.data.setUnits("")
        props.data.setTargetValue("")
        props.data.setStartValue("") 
        props.data.setDescription("")
        props.data.setDeadline("")
    }

    return (
        <Dialog onClose={() => handleCloseModal(setOpenAddModal)} open={openAddModal} fullWidth maxWidth={props.maxWidth ? props.maxWidth: "md"} className={classes.formDialog}>

            <div className={classes.DialogHeader}>
                <Typography variant="h4" className={classes.DialogHeaderText}>{header}</Typography>

                <IconButton aria-label="close" onClick={() => handleCloseModal(setOpenAddModal)} style={{}}>
                    <CloseIcon />
                </IconButton>
            </div>

            <Divider />

            <div className={classes.FormContainer}>
                <FormContext.Provider value={props.data}>
                    {props.children}
                </FormContext.Provider>
            </div>

        </Dialog>
    )
}

export default DialogComponent