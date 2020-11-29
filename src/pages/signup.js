import React, { useState } from "react"
import firebase from '../firebase/firebase'
import { Typography } from '@material-ui/core'
import NavBar from "../components/navigation/navbar"
import { withRouter } from "react-router-dom"

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
    }
}));

function SignUpPage(props) {
    const classes = useStyles();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <React.Fragment>
            <NavBar />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12}>
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
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={(e) => {
                                if (!firebase.getCurrentUserId()) {
                                    onRegister(e, props.history, firstName, lastName, email, password, props.setUser)
                                } else {
                                    alert("Sign out before creating new account!");
                                    props.history.replace("/dashboard/userId=" + firebase.getCurrentUserId())
                                }

                            }}
                        >
                            Sign Up
                    </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link onClick={() => props.history.replace("/signin")} variant="body2" className={classes.link}>
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

function putUserDataToDB(props) {
    //console.log(props.geo.country)
    firebase.db.ref(firebase.getCurrentUserId() + "/user-info").set({
        name: props.name,
        email: props.email,
        mobile_num: props.mobile_num,
        address: props.address,
        birthday: props.birthday,
        bio: props.bio,
        avatarUrl: props.avatarUrl
    });
    getUserData().then((geo) => {
        console.log(geo)
        firebase.db.ref(firebase.getCurrentUserId() + "/user-info/geolocation").set({
            country: geo.country,
            countryCode: geo.countryCode,
            regionName: geo.regionName,
            city: geo.city,
            zip: geo.zip,
            lat: geo.lat,
            lon: geo.lon,
            timezone: geo.timezone,
            org: geo.org,
            ip: geo.query
        })
    })

}

async function getUserData() {
    let response = await fetch("http://ip-api.com/json/")
    const json = await response.json()
    return json
}

async function onRegister(e, history, name, surname, email, password, setUser) {
    e.preventDefault()
    try {
        await firebase.register(name, surname, email, password)
        sessionStorage.setItem("Auth", true)
        setUser({id: firebase.getCurrentUserId(), auth: true, name: firebase.auth.currentUser.displayName})  //updating redux state
        alert("You have successfully registered! Congrats!")
        history.replace("/dashboard/userId=" + firebase.getCurrentUserId())
    } catch (error) {
        //alert(error.message)
        console.log(error.message)
    }
}


export default withRouter(SignUpPage);