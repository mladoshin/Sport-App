import React, { useState, useEffect } from "react"
import { Container, Typography, Switch, FormControlLabel, FormControl, InputLabel, Select, Avatar, Button, CssBaseline, TextField, Checkbox, Link, Grid } from '@material-ui/core'
import { withRouter } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';

// Importing icons
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// Importing firebase object to connect to backend
import firebase from '../../firebase/firebase'

import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

// declaring styles
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        cursor: "pointer"
    },
    formControl: {
        width: "100%"
    }
}));

function SignUpPage(props) {
    const classes = useStyles();

    //states for the form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCoach, setIsCoach] = useState(false)
    const [discipline, setDiscipline] = useState("")

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(firebase.auth);


    // useEffect(() => {

    //     console.log(user)

    //     if (user) {

    //         //update user's auth profile
    //         firebase.auth.currentUser.updateProfile({
    //             displayName: firstName + " " + lastName,
    //             userEmail: email
    //         })

    //         //adding the coach role to custom claims if the user signed up for the coach account
    //         if (isCoach && email !== "admin@admin.com") {
    //             firebase.addCoachRole(email).then(res => console.log(res))
    //         } else if (!isCoach) {
    //             firebase.addSportsmanRole(email).then(res => console.log(res))
    //         } else if (email == "admin@admin.com" && !isCoach) {
    //             firebase.addAdminRole(email).then(res => console.log(res))
    //         }

    //         //set the session storage property Auth to true
    //         sessionStorage.setItem("Auth", true)
    //         alert("You have successfully registered! Congrats!")

    //         //Write to database
    //         putUserDataToDB({ name: firstName, surname: lastName, email: email, isCoach: isCoach })
    //     }

    // }, [user])

    console.log("isCoach = " + isCoach)

    //function for clearing all the states after switching between coach signup and sportsman signup
    function clearState() {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setDiscipline("")
    }

    //function for switching between coach signup and sportsman signup
    function switchPage(val) {
        clearState()
        setIsCoach(val)
    }

    function handleRegisterBtn_Click(e) {
        e.preventDefault()
        //check if the user is signed out
        if (!firebase.getCurrentUserId()) {
            //register new user

            // createUserWithEmailAndPassword(email, password)


            onRegister(e, props.history, firstName, lastName, email, password, isCoach).then(() => {

                //log the user out after the registration
                firebase.logout()
                console.log("The user has been logged out after registration successfully!")

                //adding the coach role to custom claims if the user signed up for the coach account
                if (isCoach && email !== "admin@admin.com") {
                    firebase.addCoachRole(email).then(res => console.log(res))
                } else if (!isCoach) {
                    firebase.addSportsmanRole(email).then(res => console.log(res))
                } else if (email == "admin@admin.com" && !isCoach) {
                    firebase.addAdminRole(email).then(res => console.log(res))
                }



            })
        } else {
            //the user is already signed in
            alert("Sign out before creating new account!");
            props.history.replace("/dashboard/userId=" + firebase.getCurrentUserId())
        }
    }


    return (
        <React.Fragment>
            {/* <HomeNavbar goToPage={props.history.push} /> */}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>

                    <FormControlLabel
                        control={<Switch checked={isCoach} onChange={(e) => switchPage(e.target.checked)} name="checkedA" />}
                        label="Sign up as a coach"
                    />

                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {/* Name text input */}
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    autoFocus
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                {/* Surname text input */}
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>

                            {isCoach ?
                                <Grid item xs={12}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Discipline</InputLabel>
                                        {/* Select input ONLY FOR COACHES */}
                                        <Select
                                            native
                                            value={discipline}
                                            onChange={(e) => setDiscipline(e.target.value)}
                                            label="Discipline"
                                            inputProps={{
                                                name: 'discipline',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >
                                            <option aria-label="None" value="" />
                                            <option value="none">None</option>
                                            <option value={"TrackAndField"}>Track and Field</option>
                                            <option value={"StrengthAndConditioning"}>Strength and Conditioning</option>
                                            <option value={"Running"}>Running</option>
                                        </Select>
                                    </FormControl>
                                </Grid> : null}

                            <Grid item xs={12}>
                                {/* Email text input */}
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {/* Password text input */}
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {/* Checkbox input (advertisement) */}
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        {/* SignUp button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={(e) => handleRegisterBtn_Click(e)}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                {/* Link login page (if the user already has an account) */}
                                <Link onClick={() => props.history.replace("/login")} variant="body2" className={classes.link}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>


        </React.Fragment>

    );
}

// function for adding the user personal details into db (for new users)
function putUserDataToDB(props) {
    const uid = firebase.getCurrentUserId()

    // adding user's details into db
    firebase.firedDB.collection("users").doc(uid).set({
        name: props.name,
        surname: props.surname,
        role: props.isCoach ? "COACH" : "SPORTSMAN",
        email: props.email,
        mobile_num: props.mobile_num ? props.mobile_num : null,
        discipline: props.discipline ? props.discipline : null,
        photoURL: null

    });

    // initialising the user's app theme in database
    firebase.firedDB.collection("users").doc(uid).collection("private").doc("preferences").set({
        appTheme: "light"
    })


}


//async register function
async function onRegister(e, history, name, surname, email, password, isCoach) {
    e.preventDefault()

    try {
        await firebase.register(name, surname, email, password)

        //set the session storage property Auth to true
        sessionStorage.setItem("Auth", true)
        alert("You have successfully registered! Congrats!")

        //redirect to login forms
        history.replace("/login")



        //Write to database
        putUserDataToDB({ name: name, surname: surname, email: email, isCoach: isCoach })

    } catch (error) {
        //display an error
        console.log(error.message)
    }
}

//async function for logging in 
async function login(email, password) {

    try {
        //login 
        await firebase.login(email, password)
        await console.log("Successfull login")

        //set sessionStorage property Auth
        sessionStorage.setItem("Auth", true)

    } catch (error) {
        alert(error.message)
    }
}


export default withRouter(SignUpPage);