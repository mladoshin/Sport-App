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
import Profile from './pages/adminApp/profile';

function App(props) {

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
          
          {/* SPORTSMAN APP ROUTES*/}
          <Route exact path="/sportsmanApp/userId=:userId" render={() => <SportsmanApp/>} />
          <Route exact path="/sportsmanApp/userId=:userId/profile" render={() => <Profile/>} />

          {/* COACH APP ROUTES*/}
          <Route exact path="/coachApp/coachId=:coachId" render={() => <CoachApp/>} />
          <Route exact path="/coachApp/coachId=:coachId/profile" render={() => <Profile/>} />

          {/* ADMIN APP ROUTES*/}
          <Route exact path="/adminApp" render={() => <MiniDrawer mobile={props.isTouchable}><AdminApp/></MiniDrawer>} />
          <Route exact path="/adminApp/profile" render={() => <MiniDrawer mobile={props.isTouchable}><Profile/></MiniDrawer>} />

          <Route exact path="/404" render={() => <ErrorPage/>} />


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
