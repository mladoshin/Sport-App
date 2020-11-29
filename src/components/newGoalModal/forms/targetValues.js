import React, { useContext } from "react"
import { TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import FormContext from "../context/formContext"

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
        margin: theme.spacing(1)
    },
    textInput: {
        margin: theme.spacing(1)
    },
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

function ValuesForm(props) {
    const classes = useStyles()
    const form = useContext(FormContext)
    console.log(form.isUpdating)

    return (
        <form className={classes.container}>
            <FormControl variant="outlined" className={classes.formControl}>

                <InputLabel id="demo-simple-select-outlined-label">Units</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={form.units}
                    onChange={(e) => form.setUnits(e.target.value)}
                    label="Units"

                >
                    <MenuItem value="m" style={{ display: form.type !== "distance" ? "none" : "block" }}>m</MenuItem>
                    <MenuItem value="km" style={{ display: form.type !== "distance" ? "none" : "block" }}>km</MenuItem>

                    <MenuItem value="reps" style={{ display: form.type !== "reps" ? "none" : "block" }}>Reps</MenuItem>

                    <MenuItem value="sec" style={{ display: form.type !== "time" ? "none" : "block" }}>sec</MenuItem>
                    <MenuItem value="hrs" style={{ display: form.type !== "time" ? "none" : "block" }}>hrs</MenuItem>

                    <MenuItem value="kg" style={{ display: form.type !== "weight" ? "none" : "block" }}>kg</MenuItem>
                    <MenuItem value="g" style={{ display: form.type !== "weight" ? "none" : "block" }}>g</MenuItem>

                    <MenuItem value="kg" style={{ display: form.type !== "weightreps" ? "none" : "block" }}>kg * reps</MenuItem>
                    <MenuItem value="g" style={{ display: form.type !== "weightreps" ? "none" : "block" }}>g * reps</MenuItem>

                </Select>
            </FormControl>

            <div style={{ display: "flex", flexDirection: "row" }}>

                <FormControl style={{ width: "100%" }}>
                    <TextField
                        id="outlined-basic-1"
                        label="Target value"
                        variant="outlined"
                        value={form.targetValue}
                        onChange={(e) => form.setTargetValue(e.target.value)}
                        className={classes.textInput}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{form.units}</InputAdornment>,
                        }}
                    />
                </FormControl>

                {form.type == "weightreps" ?
                    <FormControl style={{ width: "100%"}}>
                        <TextField
                            id="outlined-basic-2"
                            label="Target reps value"
                            variant="outlined"
                            value={form.targetRepsValue}
                            onChange={(e) => form.setTargetRepsValue(e.target.value)}
                            className={classes.textInput}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">reps</InputAdornment>,
                            }} />
                    </FormControl> : null}

            </div>


            <div style={{ display: "flex", flexDirection: "row" }}>
                <FormControl style={{ width: "100%" }}>
                    <TextField
                        id="outlined-basic-3"
                        label={form.isUpdating ? "Current value" : "Start value"}
                        variant="outlined"
                        value={form.startValue}
                        onChange={(e) => form.setStartValue(e.target.value)}
                        className={classes.textInput}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{form.units}</InputAdornment>,
                        }} />
                </FormControl>

                {form.type == "weightreps" ?
                    <FormControl style={{ width: "100%", flexBasis: "100%" }}>
                        <TextField
                            id="outlined-basic-4"
                            label={form.isUpdating ? "Current reps value" : "Start reps value"}
                            variant="outlined"
                            value={form.startRepsValue}
                            onChange={(e) => form.setStartRepsValue(e.target.value)}
                            className={classes.textInput}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">reps</InputAdornment>,
                            }} />
                    </FormControl>
                    : null}
            </div>





        </form>
    )
}

export default ValuesForm;