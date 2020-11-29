import React, { useState, useEffect } from "react"
import { DialogActions, Button } from '@material-ui/core'
import DialogComponent from "../DialogComponent/dialog";
import ModalStepper from "../newGoalModal/modalStepper"
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom"
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
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
    }

}));

function GoalModal(props) {

    const [goalName, setGoalName] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState("")
    const [units, setUnits] = useState("")
    const [targetValue, setTargetValue] = useState("")
    const [startValue, setStartValue] = useState("")
    const [targetRepsValue, setTargetRepsValue] = useState(null)
    const [startRepsValue, setStartRepsValue] = useState(null)
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState(Date.now());
    const [openTimeInput, setOpenTimeInput] = useState(false)
    const [activeStep, setActiveStep] = useState(0)

    const openAddModal = props.openAddModal
    const setOpenAddModal = props.setOpenAddModal

    const classes = useStyles()

    useEffect(() => {
        if (props.goal) {
            setGoalName(props.goal.name)
            setCategory(props.goal.category)
            setType(props.goal.type)
            setUnits(props.goal.units)
            setTargetValue(props.goal.targetValue)
            setStartValue(props.goal.currentValue) //if you edit the current value should be there
            setDescription(props.goal.description)
            setDeadline(props.goal.deadline)
            setStartRepsValue(props.goal.currentRepsValue)
            setTargetRepsValue(props.goal.targetRepsValue)
        } else if (props.category) {
            setCategory(props.category)
        }
    }, [])

    {/*header for the Modal*/ }
    var header = ""
    if (props.goal) {
        header = 'Edit the ' + props.goal.name
    } else if (category) {
        header = "Add new goal to " + category
    } else {
        header = "Add new goal"
    }
    {/*###header for the Modal###*/ }

    function handleDelete(){
        firebase.deleteGoal(props.goal.id)
        props.history.push("/dashboard/userId="+firebase.getCurrentUserId()+"/goals/"+props.goal.category+"/filter=none")
    }

    const handleBtnClick = () => {
        if (activeStep < 3) {
            setActiveStep(activeStep + 1)
        } else {
            if (goalName && category && type && units && targetValue && startValue && (deadline > Date.now())) {
                if (type === "weightreps" && !targetRepsValue && !startRepsValue) {
                    alert("Enter the reps value!")
                    return 0
                }
                if (props.goal) {
                    console.log(props.goal.startValue, startValue, props.goal.targetValue)

                    if (startValue >= Math.min(props.goal.startValue, props.goal.targetValue) && startValue <= Math.max(props.goal.targetValue, props.goal.startValue)) {
                        console.log("Updating the goal!")
                        firebase.updateGoal({ name: goalName, category, type, units, targetValue, startValue, deadline, description, id: props.goal.id, startRepsValue, targetRepsValue })
                    } else {
                        alert("Current value should be in the valid range!")
                    }
                } else {
                    firebase.addNewGoal({ name: goalName, category, type, units, targetValue, startValue, deadline, description, startRepsValue, targetRepsValue })
                    console.log(goalName, category, type, units, targetValue, startValue, description, deadline)
                    alert("New goal has been created!")
                }

                setOpenAddModal(false)

            } else if (deadline <= Date.now()) {
                alert("Deadline Error! Pick the right date!")
            } else {
                alert("Required text fields are not filled!")
            }
        }
    }

    return (
        <DialogComponent header={header} setOpenAddModal={setOpenAddModal} openAddModal={openAddModal} setActiveStep={setActiveStep} activeStep={activeStep} data={{ startRepsValue, targetRepsValue, goalName, setGoalName, category, setCategory, type, setType, units, setUnits, targetValue, setTargetValue, startValue, setStartValue, description, setDescription, deadline, setDeadline, openTimeInput, setOpenTimeInput, setStartRepsValue, setTargetRepsValue, isUpdating: props.goal ? true : false }} clearState={false}>

            <ModalStepper setActiveStep={setActiveStep} activeStep={activeStep} />

            {/*   Dialog Actions    */}
            <DialogActions className={classes.DialogActions}>
                <div style={{flexGrow: 1}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        startIcon={<DeleteRoundedIcon/>}
                    >
                        Delete
                    </Button>
                </div>
                <div>
                    <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBtnClick}
                    >
                        {activeStep === 3 ? "Add" : "Next"}
                    </Button>
                </div>
            </DialogActions>

        </DialogComponent>
    )
}

export default withRouter(GoalModal)