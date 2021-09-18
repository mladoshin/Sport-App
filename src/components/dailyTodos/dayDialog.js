import React, { useState, useEffect } from 'react';
import { connect } from "react-redux"
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Dialog, Typography, Checkbox, ListItemText, ListItemSecondaryAction, ListItem, List, ListItemIcon, Card } from "@material-ui/core"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import firebase from "../../firebase/firebase"

const userId = "jncnru2u934jd"

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


function TodoItem(props) {

    function handleChange(e) {
        if (e.target.checked) {
            firebase.completeTodo(userId, props.todo.id)
        } else {
            firebase.uncompleteTodo(userId, props.todo.id)
        }
    }

    return (
        <ListItem dense style={{ backgroundColor: props.todo.completed ? "#81c784" : "#e57373" }}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={props.todo.completed}
                    tabIndex={-1}
                    disableRipple
                    onChange={(e) => handleChange(e)}

                />
            </ListItemIcon>
            <ListItemText primary={props.todo.name} />
        </ListItem>
    )
}

function TodoList(props) {
    //console.log(props.todos)

    const todos = props.todos.map((todo, index) => {
        return <TodoItem todo={todo} key={index} />
    })

    return (
        <List>
            {todos}
        </List>
    )

}


function HabitItem(props) {
    const [checked, setChecked] = useState(false)



    useEffect(() => {
        if (props.date) {
            firebase.getHabitStatusForDate(userId, props.habit.id, props.date, setChecked)
        }

    }, [props.date])

    function handleChange(e) {
        if (e.target.checked) {
            setChecked(true)
            props.completeHabit(props.habit.id)
        } else {
            setChecked(false)
            props.uncompleteHabit(props.habit.id)
        }
    }

    return (
        <ListItem dense style={{ backgroundColor: checked ? "#81c784" : "#e57373" }}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    checked={checked}
                    onChange={(e) => handleChange(e)}

                />
            </ListItemIcon>
            <ListItemText primary={props.habit.name} />
        </ListItem>
    )
}

function HabitList(props) {
    //console.log(props.todos)

    //console.log("completedhabits: "+props.completedHabits)

    function completeHabit(habitId) {
        firebase.completeHabit(userId, props.date, habitId)
        //firebase.changeCompletedHabits(userId, props.dateId, props.completedHabits, 1) 
    }

    function uncompleteHabit(habitId) {
        firebase.uncompleteHabit(userId, props.date, habitId)
        //firebase.changeCompletedHabits(userId, props.dateId, props.completedHabits, -1)
    }

    const habits = props.habits.map((habit, index) => {
        return <HabitItem habit={habit} key={index} completeHabit={completeHabit} uncompleteHabit={uncompleteHabit} date={props.date} />
    })

    return (
        <List>
            {habits}
        </List>
    )

}



function DayDialog(props) {
    const [todos, setToDos] = useState()
    const [name, setName] = useState("")
    const [habits, setHabits] = useState([])
    const date = new Date(props.open.payload.dateStr).toLocaleString('default', { dateStyle: "full" })

    useEffect(() => {
        console.log("useEffect")
        if (props.open.mode !== "CREATE") {
            //firebase.getDayContent(userId, props.dayId, setDayContent)

        }
        if (props.open.payload !== false) {
            firebase.getTodos(props.user.uid, props.open.payload.dateStr, setToDos)

            //load the RELEVANT habits
            loadHabits()
            console.log("adding todos!")
        }

        if (props.open.mode == "WATCH") {
            setName(props.open.name)
        }

    }, [props.open.payload])

    useEffect(() => {
        loadHabits()
    }, [props.habits])


    //function for processing if the selected day has the habit, acoording to the habit's repetition preferences
    function loadHabits() {
        let relevant_habits = []
        props.habits.forEach((habit, index) => {
            let habitStartDate = new Date(habit.startDate).getTime()
            let dayDate = new Date(props.open.payload.dateStr).getTime()
            //console.log("Habit start Date: " + habit.startDate + "   Day date: " + props.open.payload.dateStr)
            //console.log("Habit start Date: " + habitStartDate + "   Day date: " + dayDate)

            if (habit.type == "daily") {
                //check if the day have the habit which occurs daily
                if (habitStartDate <= dayDate) {
                    relevant_habits.push(habit)
                }
            } else if (habit.type == "weekly") {
                //check if a day have a habit wich occurs every week on a same weekday
                let weekDay = new Date(habitStartDate).getDay()
                let dayWeekDay = new Date(dayDate).getDay()
                console.log("Habit weekday: " + weekDay + "     Selected Day weekday: " + dayWeekDay)
                if (weekDay == dayWeekDay && habitStartDate <= dayDate) {
                    relevant_habits.push(habit)
                }

            } else if (habit.type == "monthly") {
                //check if the habit can be on particular day in different months (according to date, which will be the same for every habit)
                let habitDate = new Date(habitStartDate).getDate()
                let selDayDate = new Date(dayDate).getDate()
                console.log("Habit date: " + habitDate + "     Selected Day date: " + selDayDate)
                if (habitDate == selDayDate && habitStartDate <= dayDate) {
                    relevant_habits.push(habit)
                }
            } else if (habit.type == "custom") {
                //add processing for custom habit repetition (according to weekdays)
                let days = habit.days
                let dayWeekDay = new Date(dayDate).getDay()
                if (days) {
                    if (days.indexOf(dayWeekDay) + 1) {
                        relevant_habits.push(habit)
                    }
                }

            }

        })
        //set the final state
        setHabits(relevant_habits)
    }

    function NameField(props) {
        if (props.mode == "WATCH") {
            return <Typography>{props.name}</Typography>
        } else {
            return <TextField id="standa  rd-basic" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        }
    }

    function switchToEditMode() {
        props.setOpen({ payload: props.open.payload, mode: "EDIT", name: name, id: props.open.id })
    }

    function ActionButton(props) {
        if (props.mode == "WATCH") {
            return (
                <Button color="primary" onClick={switchToEditMode}>
                    Edit
                </Button>
            )
        } else if (props.mode == "EDIT") {
            return (
                <Button color="primary" onClick={handleUpdateDayContent}>
                    Save changes
                </Button>
            )
        } else if (props.mode == "CREATE") {
            return (
                <Button color="primary" onClick={handleSaveEvent}>
                    Create
                </Button>
            )
        }
    }

    function handleUpdateDayContent(payload) {
        console.log("Updating the day content!")
        let consent = window.confirm("Do you want to save changes?")
        if (consent) {
            firebase.updateDayContentName(userId, props.open.id, name)
        }

    }

    const handleClose = () => {
        setToDos([])
        setName("")
        props.setOpen({ payload: false, mode: "WATCH" })
    };

    function handleDeleteDay() {
        let consent = window.confirm("Do you want to delete the day?")
        if (consent) {
            firebase.deleteDay(userId, props.open.payload.dateStr, props.open.id)
        }

    }

    function handleSaveEvent() {
        switchToEditMode()
        handleClose()
        firebase.addDayContent(userId, "someId", { name: name, date: props.open.payload.dateStr })
    }

    function handleAddToDo() {
        let name = window.prompt("Name of todo: ")
        let todo = {
            name: name,
            completed: false,
            date: props.open.payload.dateStr,
            timestamp: Date.now()
        }
        if (name) {
            firebase.addTodo(userId, todo)
        }

    }

    console.log(props.open)


    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.open.payload ? true : false} maxWidth="lg" fullWidth={true} style={{ minHeight: 900 }} pap>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.open ? date : ""}
                <div>
                    <Button onClick={props.previousDay}>Prev day</Button>
                    <Button onClick={props.nextDay}>Next day</Button>
                </div>
            </DialogTitle>

            <DialogContent dividers>
                {/*<NameField mode={props.open.mode} name={name}/>*/}
                {props.open.mode == "WATCH" ? <Typography>{name}</Typography> : <TextField id="standa  rd-basic" label="Name" value={name} onChange={(e) => setName(e.target.value)} />}
                <p>Content</p>
                <Card style={{ paddingBottom: 15 }}>
                    <center><h3>ToDos</h3></center>

                    <TodoList todos={todos ? todos : []} />
                    <center><Button variant="contained" color="primary" onClick={handleAddToDo}>Add todo</Button></center>
                </Card>
                <hr />
                <Card style={{ paddingBottom: 15 }}>
                    <center><h3>Habits</h3></center>
                    <HabitList habits={habits} date={props.open.payload.dateStr} dateId={props.open.id} completedHabits={props.open.completedHabits} />

                    <center><Button variant="contained" color="primary" onClick={props.handleAddHabit}>Add Habit</Button></center>
                </Card>




            </DialogContent>

            <DialogActions>

                <ActionButton mode={props.open.mode} />

                <Button color="primary" onClick={handleDeleteDay}>
                    Delete
                </Button>

            </DialogActions>
        </Dialog>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(DayDialog);