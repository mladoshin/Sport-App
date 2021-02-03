import React, { useState } from "react"
import firebase from '../../firebase/firebase'
import { Typography, Switch, FormControlLabel, FormControl, InputLabel, Select } from '@material-ui/core'
import HomeNavbar from "../../components/navigation/homeNavbar"
import { withRouter } from "react-router-dom"

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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

    console.log("isCoach = "+isCoach)

    //function for clearing all the states after switching between coach signup and sportsman signup
    function clearState(){
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setDiscipline("")
    }

    //function for switching between coach signup and sportsman signup
    function switchPage(val){
        clearState()
        setIsCoach(val)
    }

    function handleRegisterBtn_Click(e){
        //check if the user is signed out
        if (!firebase.getCurrentUserId()) {
            //register new user
            onRegister(e, props.history, firstName, lastName, email, password, isCoach).then(() => {

                //adding the coach role to custom claims if the user signed up for the coach account
                if (isCoach){
                    firebase.addCoachRole({email: email}).then(res => console.log(res))
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
            <HomeNavbar goToPage={props.history.push} />
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

                            {isCoach ?
                                <Grid item xs={12}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Discipline</InputLabel>
                                        <Select
                                            native
                                            value={discipline}
                                            onChange={(e)=>setDiscipline(e.target.value)}
                                            label="Discipline"
                                            inputProps={{
                                                name: 'discipline',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >
                                            <option aria-label="None" value=""/>
                                            <option  value="none">None</option>
                                            <option value={"TrackAndField"}>Track and Field</option>
                                            <option value={"StrengthAndConditioning"}>Strength and Conditioning</option>
                                            <option value={"Running"}>Running</option>
                                        </Select>
                                    </FormControl>
                                </Grid> : null}

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
                            onClick={(e) => handleRegisterBtn_Click(e)}
                        >
                            Sign Up
                    </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link onClick={() => props.history.replace("/sportsman-login")} variant="body2" className={classes.link}>
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

//function for writing user-information into the database
function putUserDataToDB(props) {
    const uid = firebase.getCurrentUserId()

    getUserData().then((geo) => {
        
        let geolocation = {
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
        }
        
        //writing into realtime database
        firebase.db.ref(uid + "/user-info").set({
            name: props.name,
            surname: props.surname,
            coach: props.isCoach,
            email: props.email,
            mobile_num: props.mobile_num ? props.mobile_num : null,
            discipline: props.discipline ? props.discipline : null,
            geolocation: geolocation
    
        });
    })

}

//get the geolocation json data from the api
async function getUserData() {
    let response = await fetch("http://ip-api.com/json/")
    const json = await response.json()
    return json
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
        if (!isCoach){
            history.replace("/sportsman-login")
        }else{
            history.replace("/coach-login")
        }
        
        //Write to database
        putUserDataToDB({name: name, surname: surname, email: email, isCoach: isCoach})
    } catch (error) {
        //display an error
        console.log(error.message)
    }
}


export default withRouter(SignUpPage);