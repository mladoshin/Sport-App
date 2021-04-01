import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter, withRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import firebase from './firebase/firebase'
import isTouchable from "./checkDeviceFunction/isTouchable"

import HomePage from "./pages/landingPage/homePage"
import SignInPage from "./pages/landingPage/signin"
import SignUpPage from "./pages/landingPage/signup"
import ErrorPage from "./pages/404"

import SportsmanApp from './pages/sportsmanApp/sportsmanApp';
import CoachApp from './pages/coachApp/coachApp';
import AdminApp from './pages/adminApp/adminApp';
import MiniDrawer from './components/navigation/desktopNavbar';
import AdminProfile from './pages/adminApp/profile';
import CoachProfile from './pages/coachApp/profile';
import SportsmanProfile from './pages/sportsmanApp/profile';
import Navbar from './components/navigation/navbar';
import WorkoutDiary from './pages/adminApp/workoutDiary';
import WorkoutsPage from './pages/coachApp/workoutsPage';
import CalendarPage from './pages/coachApp/calendarPage';

function App(props) {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)

  /*useEffect(() => {
    if (!isFirebaseInit) {

      firebase.isInit().then(val => {
        //console.log(val)
        //check if the user is autorized

        if (firebase.getCurrentUserId()) {
          //get the user's custom claims
          firebase.auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
              return idTokenResult.claims
            }).then((claims) => {
              let userInfo = {
                displayName: firebase.auth.currentUser.displayName,
                email: firebase.auth.currentUser.email,
                phoneNumber: firebase.auth.currentUser.phoneNumber,
                emailVerified: firebase.auth.currentUser.emailVerified,
                photoURL: firebase.auth.currentUser.photoURL,
                uid: firebase.auth.currentUser.uid,
                claims: claims
              }
              //console.log(userInfo)
              
              return userInfo
            }).then(userInfo => {
              props.setUser(userInfo)
              
            })
            .catch((error) => {
              console.log(error);
              //props.history.replace("/404")
            });
        }

      })
    }
  }, [isFirebaseInit])*/

  

  useEffect(() => {
    console.log(props.user)
  }, [props.user])

  useEffect(() => {
    //set the isTouchabe (from isTouchable function) to redux
    props.setIsTouchable(isTouchable())
    props.setTheme("light")
    firebase.getCurrentUser(props.setUser)

    //console.log(firebase.getCurrentUserId())
  }, [])

  //console.log(props.theme)

  const DarkTheme = createMuiTheme({
    palette: {
      type: "dark"
    }
  })

  const LightTheme = createMuiTheme({
    palette: {
      type: "light"
    }
  })

  console.log(props.theme)

  return (
    <ThemeProvider theme={props.theme.colorMode === "dark" ? DarkTheme : LightTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/sportsman-login" render={() => <SignInPage isCoach={false} />} />
          <Route exact path="/coach-login" render={() => <SignInPage isCoach={true} />} />
          <Route exact path="/signup" render={() => <SignUpPage />} />
          <Route exact path="/coach-login" render={() => <SignInPage />} />

          {/* SPORTSMAN APP ROUTES*/}
          <Route exact path="/sportsmanApp/userId=:userId" render={() => <Navbar><SportsmanApp /></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/profile" render={() => <Navbar><SportsmanProfile /></Navbar>} />

          {/* COACH APP ROUTES*/}
          <Route exact path="/coachApp/coachId=:coachId" render={() => <Navbar><CoachApp /></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/profile" render={() => <Navbar><CoachProfile /></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/workouts" render={() => <Navbar><WorkoutsPage/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/calendar" render={() => <Navbar><CalendarPage/></Navbar>} />

          {/* ADMIN APP ROUTES*/}
          <Route exact path="/adminApp" render={() => <Navbar><AdminApp /></Navbar>} />
          <Route exact path="/adminApp/profile" render={() => <Navbar><AdminProfile /></Navbar>} />
          <Route exact path="/adminApp/diary" render={() => <Navbar><WorkoutDiary /></Navbar>} />

          <Route render={() => <ErrorPage />} />


        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );

}

const mapStateToProps = state => {
  return {
    isTouchable: state.isTouchable,
    theme: state.theme,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIsTouchable: (val) => dispatch({ type: "ISTOUCHABLE/SET", payload: val }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
