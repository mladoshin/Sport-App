//<-----------------------SIGNIN PAGE----------------------->//
import React, { useState } from "react"
import firebase from '../../firebase/firebase'
import { Typography, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Container } from '@material-ui/core'
import { withRouter } from "react-router-dom"
import HomeNavbar from "../../components/navigation/homeNavbar"

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';


//styles
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: "pointer"
  }
}));


function SignInPage(props) {
  const classes = useStyles();

  //states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //handles the login button click
  function handleLoginBtn_Click(e){
    if (!firebase.getCurrentUserId()) {
      login(e, email, password)
      .then(() => redirectToApp())
      .catch(error => console.log(error))
    } else {
      alert("Sign out before signing in!")
      console.log(firebase.auth.currentUser)
      redirectToApp()
      //props.history.replace("/dashboard/userId=" + firebase.getCurrentUserId())
    }
  }

  //function which checks if the user is coach or sportsman and redirects to the right app
  function redirectToApp() {
    console.log(firebase.auth.currentUser)
    firebase.auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        //display the custom claim
        console.log(idTokenResult.claims.role)

        if(email=="admin@admin.com"){
          console.log("Welcome Admin!")
        }

        //redirect to the app dashboard for both sportsman and coach
        if (idTokenResult.claims.role=="COACH") {
          props.history.replace("/coachApp/coachId=" + firebase.getCurrentUserId())
        } else if(idTokenResult.claims.role=="SPORTSMAN") {
          props.history.replace("/sportsmanApp/userId=" + firebase.getCurrentUserId())
        }else if(idTokenResult.claims.role=="ADMIN"){
          props.history.replace("/adminApp")
        }

      })
      .catch((error) => {
        console.log(error);
      });
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
            Sign in
                    </Typography>

          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => handleLoginBtn_Click(e)}
            >
              Sign In
                    </Button>
            <Grid container>
              <Grid item xs>
                <Link onClick={() => props.history.replace("/reset-password")} variant="body2" className={classes.link}>
                  Forgot password?
                        </Link>
              </Grid>
              <Grid item>
                <Link onClick={() => props.history.replace("/signup")} variant="body2" className={classes.link}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </React.Fragment>

  );
}

// //function for fetching the geolocation information about a user
// async function getUserData() {
//   let response = await fetch("http://ip-api.com/json/")
//   const json = await response.json()
//   return json
// }

// //function for checking the current ip and comparing it to the original from realtime database
// function checkIP(ugeo){
//   getUserData().then(geo => {
//     if(geo.ip!==ugeo.ip && geo.city !== ugeo.city){
//       console.log("The account has been accessed from the different place")
//     }else{
//       console.log("The IP check is successful!")
//     }
//   })
// }


//async function for logging in 
async function login(e, email, password) {
  e.preventDefault()

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



export default withRouter(SignInPage);