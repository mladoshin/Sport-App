import { Container } from "@material-ui/core";
import React from "react"
import { withRouter, useParams } from "react-router-dom";
import WorkoutPlanCalendar from "../components/trainingGroups/workoutPlanCalendar"

function WorkoutPlanPage(props){
    const {planId} = useParams()
    return(
        <Container>
            <h1>PlanId = {planId}</h1>
            <WorkoutPlanCalendar/>

        </Container>
    )
}

export default withRouter(WorkoutPlanPage);