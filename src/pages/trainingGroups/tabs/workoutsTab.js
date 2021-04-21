import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import WorkoutComponent from "../../workoutBuilder/App"
import TodoCalendar from "../../dailyTodos/App"
import { Button, Grid, List, ListItem, Paper } from "@material-ui/core"
import { Container, CssBaseline, Tooltip, FormControlLabel, FormControl, MenuItem, ListItemText, Checkbox, InputLabel, Input, Select, Dialog, AppBar, Toolbar, IconButton, Switch, Avatar, TextField } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { withRouter, useParams } from "react-router-dom";
import firebase from "../../../firebase/firebase"

import WorkoutPlanCalendar from "../workoutPlanCalendar"

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

function TrainingPlanDialog(props) {
    const [title, setTitle] = useState("")
    const [isForAllMembers, setIsForAllMembers] = useState(true)
    const [recipients, setRecipients] = useState()
    const [id, setId] = useState("")
    const classes = useStyles()

    console.log(props.open)

    useEffect(() => {
        console.log(props.open.payload)
        if (props.open.payload) {
            setTitle(props.open.payload.name)
            setRecipients(props.open.payload.recipients)

        }
    }, [props.open.payload])

    function handleClose() {
        props.setOpen({ ...props.open, payload: null })
    }

    function handleCreateWorkoutPlan() {
        let description = window.prompt("Enter plan description: ")
        alert("Creating!")
        console.log(props.group.id)
        let recipientIds
        if (isForAllMembers) {
            recipientIds = props.group.members
        } else {
            recipientIds = recipients
        }

        console.log(recipientIds)

        if (title && description) {
            firebase.createWorkoutPlan(props.group, { name: title, description: description, dateCreated: Date.now(), recipients: recipientIds }).then(id => {
                console.log("New workout plan has been created! Its id = " + id)
                handleClose()
            })
        }

    }

    function handleUpdateWorkoutPlan() {
        let updates = {}
        if (props.open.payload.name !== title) {
            console.log("The title was updated!")
            updates = { ...updates, name: title }
        }

        if (props.open.payload.recipients !== recipients) {
            console.log("The recipient list was updated!")
            updates = { ...updates, recipients: recipients }
        }

        if (isForAllMembers && props.group.members.length !== recipients.length) {
            console.log("The recipient list was updated!")
            updates = { ...updates, recipients: props.group.members }
        }

        
        firebase.updateWorkoutPlan(props.group, props.open.payload.planId, updates)
    }

    function PlanActionButton() {
        if (props.open.mode === "CREATE") {
            return (
                <Button variant="contained" color="secondary" onClick={handleCreateWorkoutPlan}>Create</Button>
            )
        } else if (props.open.mode === "EDIT") {
            return (
                <Button color="secondary" variant="contained" onClick={handleUpdateWorkoutPlan}>Save</Button>
            )
        } else {
            return null
        }
    }

    function PlanTitle(props) {
        const title = props.title
        const setTitle = props.setTitle
        if (props.mode === "READONLY") {
            return (
                <h1>{title}</h1>
            )
        } else {
            return (
                <TextField label="Enter a name" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1 }}/>
            )
        }

    }

    function PlanMemberForm() {
        if (props.open.mode === "READONLY") {
            return null
        } else {
            return (
                <>
                    <FormControlLabel
                        control={<Switch checked={isForAllMembers} onChange={(e) => setIsForAllMembers(e.target.checked)} name="checkedA" />}
                        label="All members"
                    />
                    {!isForAllMembers &&
                        <div>
                            <TextField variant="outlined" label="Member id:" value={id} onChange={(e) => setId(e.target.value)} />
                            <Button onClick={() => setRecipients([...recipients, id])}>Add</Button>
                            <List>
                                {recipients.map((recipient, i) => {
                                    return (
                                        <ListItem key={i}>
                                            <p>{i + 1}) </p>
                                            {recipient}
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </div>
                    }
                </>
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
                    
                    {props.open.mode === "READONLY" ? <h1>{title}</h1> : <TextField label="Enter a name" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1 }}/>}
                    <PlanActionButton />
                </Toolbar>
            </AppBar>
            <Container>
                <h1>Dialog Content</h1>
                <Paper style={{ minHeight: 200, padding: 15, marginBottom: 30, backgroundColor: "#eee" }} elevation={4}>
                    <p>Description: {props.open.payload && props.open.payload.description}</p>
                    <PlanMemberForm/>
                </Paper>
                <WorkoutPlanCalendar group={props.group} planId={props.open.payload && props.open.payload.planId} readOnly={props.open.mode === "READONLY"}/>
            </Container>


        </Dialog>
    )
}

function OwnerContent(props) {
    const [open, setOpen] = useState({ payload: null })
    const [plans, setPlans] = useState([])

    useEffect(() => {
        return firebase.getWorkoutPlansInTrainingGroup(props.group, setPlans)
    }, [])

    function handleOpenDialog(mode, payload) {
        setOpen({ payload: payload ? payload : null, mode: mode })
    }

    function handleDeleteWorkoutPlan(planId) {
        let consent = window.confirm("Are you sure you want to delete this workout plan? ")
        if (consent) {
            firebase.deleteWorkoutPlanFromTrainingGroup(props.group, planId)
        }

    }


    const plans_grid = (
        <Grid container spacing={4} >
            {plans.map((plan, index) => {
                return (
                    <Grid item xs={12} lg={4} key={index}>
                        <Paper style={{ backgroundColor: "#90caf9", padding: 10 }}>
                            <h1 style={{ textAlign: "center" }}>{plan.name}</h1>
                            <p>{plan.planId}</p>
                            <p>Recipients: {plan.recipients.join(", ")}</p>
                            <div style={{ width: "100%", textAlign: "right", padding: "0px 15px 0px 15px" }}>
                                <Button color="secondary" variant="outlined" onClick={() => handleDeleteWorkoutPlan(plan.planId)}>Delete</Button>
                                <Button style={{ backgroundColor: "#4caf50", marginLeft: 10 }} variant="contained" onClick={() => setOpen({ payload: { ...plan }, mode: "EDIT" })}>Open</Button>
                            </div>
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    )

    return (
        <>
            {plans_grid}

            <div style={{ width: "100%", textAlign: "center", marginTop: 30 }}>
                <Button color="primary" variant="contained" onClick={() => handleOpenDialog("CREATE", { title: "" })}>Add Training Plan</Button>
            </div>

            <TrainingPlanDialog open={open} setOpen={setOpen} group={props.group} />
        </>
    )
}

function MemberContent(props) {
    const [open, setOpen] = useState({ payload: null })
    const [memberPlans, setMemberPlans] = useState([])

    useEffect(() => {
        return firebase.getMemberWorkoutPlansFromTrainingGroup(props.group, setMemberPlans)
    }, [])

    function handleOpenDialog(mode, payload) {
        setOpen({ payload: payload ? payload : null, mode: mode })
    }


    const member_plans_grid = (
        <Grid container spacing={4} >
            {memberPlans.map((plan, index) => {
                return (
                    <Grid item xs={12} lg={4} key={index}>
                        <Paper style={{ backgroundColor: "#90caf9", padding: 10 }}>
                            <h1 style={{ textAlign: "center" }}>{plan.name}</h1>
                            <p>{plan.planId}</p>
                            <div style={{ width: "100%", textAlign: "right", padding: "0px 15px 0px 15px" }}>
                                <Button style={{ backgroundColor: "#4caf50", marginLeft: 10 }} variant="contained" onClick={() => setOpen({ payload: { ...plan }, mode: "READONLY" })}>Open</Button>
                            </div>
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    )

    return (
        <>
            <h1>Content for members</h1>

            {member_plans_grid}

            <TrainingPlanDialog open={open} setOpen={setOpen} group={props.group} />
        </>
    )
}


function WorkoutsTab(props) {



    const { groupId } = useParams()








    return (
        <div style={{ padding: 15 }}>
            <h1>Workouts Page...</h1>
            {props.user.uid === props.group.owner ? <OwnerContent group={props.group} /> : <MemberContent group={props.group} />}
        </div>
    )
}


const mapStateToProps = state => {
    return {
        user: state.user,
        theme: state.theme
    }
}

export default connect(mapStateToProps, null)(withRouter(WorkoutsTab));