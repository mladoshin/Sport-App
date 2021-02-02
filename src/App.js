import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter, withRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import firebase from './firebase/firebase'
import NavBar from './components/navigation/navbar'
import isTouchable from "./checkDeviceFunction/isTouchable"

import HomePage from "./pages/landingPage/homePage"
import SignInPage from "./pages/landingPage/signin"
import SignUpPage from "./pages/landingPage/signup"
import { auth } from 'firebase-admin';

import SportsmanApp from './pages/sportsmanApp';
import CoachApp from './pages/coachApp/coachApp';

function App(props) {

  firebase.auth.onAuthStateChanged(user => {
    if (user){
      user.getIdTokenResult().then(idTokenResult => {
        user.admin = idTokenResult.claims.isCoach
        console.log(idTokenResult.claims)
      })
    }
  })

  useEffect(() => {
    //set the isTouchabe (from isTouchable function) to redux
    props.setIsTouchable(isTouchable())
    props.setTheme("light")
  }, [])

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

  return (
    <ThemeProvider theme={props.theme === "dark" ? DarkTheme : LightTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <HomePage/>} />
          <Route exact path="/sportsman-login" render={() => <SignInPage isCoach={false}/>} />
          <Route exact path="/coach-login" render={() => <SignInPage isCoach={true}/>} />
          <Route exact path="/signup" render={() => <SignUpPage/>} />
          <Route exact path="/coach-login" render={() => <SignInPage/>} />
          <Route exact path="/dashboard/userId=:userId" render={() => <SportsmanApp/>} />
          <Route exact path="/dashboard/coachId=:coachId" render={() => <CoachApp/>} />


        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );

}

const mapStateToProps = state => {
  return {
    isTouchable: state.isTouchable,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIsTouchable: (val) => dispatch({ type: "ISTOUCHABLE/SET", payload: val }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
