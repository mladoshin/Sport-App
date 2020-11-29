import React from "react"
import { Tooltip, Fab } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "../../firebase/firebase"


const useStyles = makeStyles((theme) => ({
    fab: {
        margin: theme.spacing(2),
      },
      absolute: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
      }
}))

export default function AddTooltip(props){
    const classes = useStyles()

    function handleClick(){
        if(firebase.auth.currentUser.emailVerified){
            props.setOpenAddModal(true)
          }else{
            alert("Verify your email first!")
          }
    }

    return(
        <Tooltip title="Add" aria-label="add" onClick={handleClick} >
            <Fab color="secondary" className={classes.absolute}>
              <AddIcon />
            </Fab>
          </Tooltip>
    )
}