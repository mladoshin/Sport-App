import React, { useState } from "react"
import firebase from '../../firebase/firebase'
import { Typography, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Container, Switch } from '@material-ui/core'
import { Redirect, withRouter } from "react-router-dom"
import HomeNavbar from "../../components/navigation/homeNavbar"

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';



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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCoach, setIsCoach] = useState(false)

  firebase.logout()

  //firebase.auth.onAuthStateChanged(user => {
  //console.log(user)
  //})


  async function login(e, history, email, password, setUser) {
    e.preventDefault()

    try {

      await firebase.login(email, password)

      if (!isCoach) {
        //firebase.addCoachRole({email: email}).then(res => console.log(res))
      }

      //await firebase.isCoach(firebase.getCurrentUserId(), setIsCoach)
      //isCoachFunc(setIsCoach).then(()=>console.log(isCoach))
      await console.log("Successfull login")
      //setUser({ id: firebase.getCurrentUserId(), auth: true, name: firebase.auth.currentUser.displayName })  //updating redux state
      sessionStorage.setItem("Auth", true)


    } catch (error) {
      alert(error.message)
    }

    //return await isCoach
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

          <FormControlLabel
            control={<Switch checked={isCoach} onChange={(e) => setIsCoach(e.target.checked)} name="checkedA" />}
            label="Login as a coach"
          />

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
              onClick={(e) => {

                if (!firebase.getCurrentUserId()) {
                  login(e, props.history, email, password, props.setUser, setIsCoach).then(() => {
                    //get the user token
                    firebase.auth.currentUser.getIdTokenResult()
                      .then((idTokenResult) => {
                        //display the custom claim
                        console.log(idTokenResult.claims.coach)

                        //redirect to the app dashboard for both sportsman and coach
                        if (idTokenResult.claims.coach){
                          props.history.replace("/dashboard/coachId="+firebase.getCurrentUserId())
                        }else{
                          props.history.replace("/dashboard/userId="+firebase.getCurrentUserId())
                        }

                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                } else {
                  alert("Sign out before signing in!")
                  props.history.replace("/dashboard/userId=" + firebase.getCurrentUserId())
                }

              }}
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

async function isCoach(id, setIsCoach) {
  try {
    firebase.isCoach(firebase.getCurrentUserId(), setIsCoach)
  } catch (error) {
    console.log(error.message)
  }
}



export default withRouter(SignInPage);