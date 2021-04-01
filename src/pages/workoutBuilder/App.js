import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { Button, Dialog, IconButton, Accordion, AccordionSummary, Fab, AccordionDetails, Typography, Card, CardContent, AccordionActions } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import firebase from "../../firebase/firebase"

const userId = "fu387rvb938y4fv"
const date = new Date(Date.now()).toLocaleDateString()

function Circuit(props) {
  //console.log(props.circuit)
  const [exercises, setExercises] = useState([])
  let { circuitRef } = useRef()
  //console.log(exercises)

  useState(() => {
    //console.log(props.circuit.id)
    //firebase.getExercises(userId, props.circuit.id, setExercises)
  }, [props.circuit.id])


  let exerciseList = props.circuit.exercises.map((item, index) => {
    return (
      <Exercise key={index} exercise={item} />
    )
  })

  function handleDeleteCircuit() {

    //deleting all exercises from the circuit
    //exercises.forEach((exercise, index) => {
    //  firebase.deleteExercise(userId, exercise.id)
    //})

    //deleting the circuit
    firebase.deleteCircuit(userId, props.circuit.exercises, props.circuit.id)

  }

  function handleAddExercise() {
    let exerciseName = window.prompt("Exercise name: ")
    let reps = parseInt(window.prompt("Reps number: "))
    var exercise = {
      name: exerciseName,
      date: Date.now(),
      repsNumber: reps
    }

    firebase.addExercise(userId, exercise, props.circuit.id).then(exerciseId => {
      console.log("Exercise Id: " + exerciseId)
      let newExercises = props.circuit.exercises.map((exercise, index) => {
        return {
          name: exercise.name,
          id: exercise.id,
          date: exercise.date,
          repsNumber: exercise.repsNumber
        }
      })
      exercise.id = exerciseId

      firebase.addExerciseToCircuit(userId, props.circuit.id, exercise, newExercises)
    })
  }

  return (
    <Accordion className="MaximLadoshin" style={{ width: "100%", backgroundColor: "#757ce8", marginBottom: 10 }} ref={circuitRef} id={"accordionCard" + props.circuit.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography style={{ marginRight: 10, lineHeight: "50px" }} variant="h5">{props.circuit.name}</Typography>
        <Typography style={{ marginRight: 10, lineHeight: "50px", fontSize: 15 }}>{props.circuit.iterNum} sets</Typography>
      </AccordionSummary>
      <AccordionDetails>

        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {exerciseList}
        </div>

        <AccordionActions>
          <Button onClick={() => handleAddExercise()}>Add Exercise</Button>
          <IconButton color="secondary" onClick={handleDeleteCircuit}><DeleteIcon /></IconButton>
        </AccordionActions>

      </AccordionDetails>
    </Accordion>
  )
}

function Exercise(props) {
  return (
    <Card style={{ width: "100%", backgroundColor: "#ff7961", marginBottom: 10, padding: 0 }}>
      <CardContent style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, positio: "relative" }}>
        <div style={{ width: 200 }}>
          <h2>{props.exercise.name}</h2>
        </div>


        <div style={{ width: "90%", textAlign: "right", marginRight: "10%" }}>
          <h4 style={{ margin: 0 }}>Reps: {props.exercise.repsNumber}</h4>
          <h4 style={{ margin: 0 }}>Rest: {props.exercise.restAfter}</h4>
        </div>

      </CardContent>
    </Card>
  )
}

function WorkoutItem(props) {
  const [circuits, setCircuits] = useState([])

  useEffect(() => {

  })

  useEffect(() => {
    console.log(props.workout)
    firebase.getCircuits(userId, props.id, setCircuits)
  }, [props.workout])

  function updateCircuits() {
    firebase.getCircuits(userId, props.id, setCircuits)
    console.log("Updating list of circuits after deletion")
  }




  let circuitList = circuits.map((circuitItem, index) => {
    //console.log(circuitItem.id)
    return (
      <Circuit key={index} circuit={circuitItem} updateCircuits={updateCircuits} />
    )
  })

  function handleDeleteWorkout() {
    console.log("Deleting")

    //deleting all circuits
    circuits.forEach((circuit, index) => {
      firebase.deleteCircuit(userId, circuit.exercises, circuit.id)
    })

    //deleting the workout
    firebase.deleteWorkout(userId, props.workout.id)
  }

  function addCircuit() {
    let name = window.prompt("Circuit name: ")
    let iterNum = window.prompt("Circuit iterations? : ")
    let circuit = {
      name: name,
      iterNum: iterNum
    }
    if (name && iterNum > 0) {
      firebase.addCircuit(userId, circuit, props.workout.id).then(circuitId => {
        //console.log(circuitId)
        //firebase.addCircuitToWorkout(userId, props.workout.id, circuitId, props.workout.circuits)
      })
    } else {
      console.log("Circuit info formatted badly!")
    }

  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography style={{ marginRight: 10, lineHeight: "50px", fontSize: 15 }}>{props.workout.date}</Typography>
        <Typography variant="h5" style={{ lineHeight: "50px", marginRight: 10 }}>{props.workout.name}</Typography>
        <Typography style={{ lineHeight: "50px", marginRight: 10 }}>{props.workout.id}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: "flex", flexDirection: "column" }}>
        <Button onClick={() => firebase.getCircuits(userId, props.workout.id, setCircuits)}>Sync circuits</Button>
        {circuitList}
      </AccordionDetails>

      <AccordionActions>
        <Button onClick={() => addCircuit()}>Add Circuit</Button>
        <IconButton color="secondary" onClick={handleDeleteWorkout}><DeleteIcon /></IconButton>
      </AccordionActions>

    </Accordion>
  )
}

function WorkoutComponent(props) {
  const [workouts, setWorkouts] = useState([])
  const [open, setOpen] = useState({ mode: null, payload: false })

  console.log(workouts)

  useEffect(() => {
    console.log(props.user.uid)
    //fetch all the workouts from the database
    firebase.getWorkouts(props.user.uid, date, setWorkouts)
  }, [props.user.uid])

  function updateWorkouts() {
    firebase.getWorkouts(userId, date, setWorkouts)
  }



  const workoutList = workouts.map((workout, index) => {

    return (
      <WorkoutItem key={index} workout={workout} id={workout.id} updateWorkouts={updateWorkouts} />
    )
  })

  function handleAddWorkout() {
    let name = window.prompt("Name: ")

    if (name) {
      firebase.addWorkout(userId, date, name)
    } else {
      console.log("The name is empty!")
    }

  }

  return (
    <>
      <Fab color="primary" aria-label="add" style={{ position: "absolute", right: 20, bottom: 20 }} onClick={()=>handleAddWorkout()}>
        <AddIcon />
      </Fab>


      <div style={{ display: "flex", flexDirection: "column", width: "80%", marginLeft: "auto", marginRight: "auto",  marginTop: 30}}>
        {workoutList}
      </div>

      {open.payload ? <Dialog></Dialog> : null}
    </>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutComponent);
