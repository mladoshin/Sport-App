import React, {useContext} from "react" 
import { FormControl, TextField } from '@material-ui/core'
import FormContext from "../context/formContext"
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20, 
        display: "flex", 
        flexDirection: "column",
        [theme.breakpoints.up("xs")]: {
            height: 300
        },
        [theme.breakpoints.up("sm")]: {
            height: 350
        },
        [theme.breakpoints.up("md")]: {
            
        },
        [theme.breakpoints.up("ld")]: {

        },
        [theme.breakpoints.up("xl")]: {

        }
    }
  }));



function AdditionalForm(){
    const classes = useStyles()
    const form = useContext(FormContext)
    //console.log(form)

    return(
        <form className={classes.container}>
            <FormControl>
                <TextField label="Description" rows={4} variant="outlined" value={form.description} onChange={(e)=>form.setDescription(e.target.value)} multiline style={{minHeight: 100}}/>
            </FormControl>
        </form>
    )
}

export default AdditionalForm;