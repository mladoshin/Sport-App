import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { Paper, Typography, CssBaseline, Grid, Button } from '@material-ui/core'
import { Container } from '@material-ui/core';
import { withRouter, useParams } from "react-router-dom"
import NavBar from "../components/navigation/navbar"
import firebase from '../firebase/firebase';

import GoalModal from "../components/goalModal/goalModal"

import ProgressCard from '../components/goalDashboardComponents/progressCard'
import TimeCard from '../components/goalDashboardComponents/timeCard'
import ModalWindow from '../components/newGoalModal/modalWindow'
import ProgressChart from "../components/goalDashboardComponents/progressChart";

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    gridContainer: {

    },
    cardPaper: {
        [theme.breakpoints.up("xs")]: {
            padding: 10
        },
        [theme.breakpoints.up("sm")]: {
            padding: 15
        },
        [theme.breakpoints.up("md")]: {
            padding: 20
        },
        [theme.breakpoints.up("lg")]: {
            padding: 20
        }
    },
    mainContainer: {
        width: "100%",
        [theme.breakpoints.up("xs")]: {
            padding: "0px 5px 0px 5px"
        },
        [theme.breakpoints.up("sm")]: {
            padding: "0px 15px 0px 15px"
        },
        [theme.breakpoints.up("md")]: {
            padding: "0px 8.3% 0px 8.3%"
        },
        [theme.breakpoints.up("lg")]: {
            padding: "0px 16.6% 0px 16.6%"
        }
    },
    goalHeader: {
        display: "flex", 
        flexDirection: "row",
        alignItems: "center"
    },
    goalGen: {
        flexGrow: 1
    },
    goalActions: {

    },
    btnComplete: {
        marginLeft: 10,
        transition: "500ms linear"
    }


}));

function GoalPage(props) {
    const classes = useStyles()
    const [openAddModal, setOpenAddModal] = useState(false)
    //let { category } = useParams()
    let { goalid } = useParams()
    var goal = {}

    props.goals.map((item, index) => {
        if (item.id == goalid) {
            goal = item
        }
    })

    console.log(goal.type)


    function handleComplete() {
        if (parseFloat(goal.currentValue) == parseFloat(goal.targetValue) || goal.isCompleted) {
            if (goal.isCompleted) {
                firebase.uncompleteGoal(goal.id)
            } else {
                firebase.completeGoal(goal.id)
            }

        } else {
            alert("You haven't completed the goal!")
        }
    }

    //Goal Dashboard Component --> Goal Header
    const GoalHeader = (
        <Paper className={clsx(classes.cardPaper, classes.goalHeader)} elevation={3}>
            <div className={classes.goalGen}>
                <Typography variant="h3">{goal.name}</Typography>
                <Typography variant="body1">Category: {goal.category}</Typography>
            </div>
            <div className={classes.goalActions}>
                <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>Edit</Button>
                <Button variant="contained" className={classes.btnComplete} style={{ backgroundColor: goal.isCompleted ? "#f50057" : "#388e3c"}} onClick={handleComplete} disableTouchRipple={true}>{goal.isCompleted ? "Uncomplete" : "Complete"}</Button>
            </div>
        </Paper>
    )

    const progress = goal.progress  //value of progress of the goal

    return (
        <React.Fragment>
            <NavBar />
            <Container component="main" maxWidth="xl" className={classes.mainContainer}>
                <CssBaseline />

                <Grid container spacing={1} className={classes.gridContainer}>
                    {/* General Info Card component */}
                    <Grid item xs={12}>
                        {GoalHeader}   {/* Goal Header
                         Component */}
                    </Grid>

                    {/* Progress Card component */}
                    <Grid item xs={4}>
                        <ProgressCard percent={Math.floor(progress)} currentValue={goal.currentValue} targetValue={goal.targetValue} units={goal.units} />

                    </Grid>

                    {/* Time Progress Card component */}
                    <Grid item xs={8}>
                        <TimeCard deadline={goal.deadline} dateCreated={goal.dateCreated} />

                    </Grid>

                    {/* Description card component */}
                    <Grid item xs={12}>
                        <Paper className={classes.cardPaper} style={{ display: goal.description ? "inherit" : "none" }} elevation={3}>
                            <Typography variant="body1">Description: {goal.description}</Typography>
                        </Paper>
                    </Grid>

                    {/*Chart progress statistics component*/}
                    <Grid item xs={12}>
                        <Paper className={classes.cardPaper} elevation={3}>
                            <ProgressChart data={goal.stats} minValue={goal.startValue} targetValue={goal.targetValue} reversed={parseFloat(goal.targetValue) < parseFloat(goal.startValue) ? true : false} height={300}/>
                        </Paper>
                    </Grid>

                </Grid>


            </Container>
            {openAddModal ? <GoalModal setOpenAddModal={setOpenAddModal} openAddModal={openAddModal} goal={goal}/> : null}
        </React.Fragment>

    );
}
const mapStateToProps = state => {
    return {
        goals: state.goals
    }
}

export default connect(mapStateToProps, null)(withRouter(GoalPage));