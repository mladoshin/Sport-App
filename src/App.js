import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import firebase from './firebase/firebase'

import HomePage from "./pages/landingPage/homePage"
import SignInPage from "./pages/landingPage/signin"
import SignUpPage from "./pages/landingPage/signup"
import ErrorPage from "./pages/404"

import SportsmanApp from './pages/sportsmanApp/sportsmanApp';
import CoachApp from './pages/coachApp/coachApp';
import AdminApp from './pages/adminApp/adminApp';

import AdminProfile from './pages/adminApp/profile';
import CoachProfile from './pages/coachApp/profile';
import SportsmanProfile from './pages/sportsmanApp/profile';
import Navbar from './components/navigation/navbar';
import WorkoutDiary from './pages/adminApp/workoutDiary';
import WorkoutsPage from './pages/coachApp/workoutsPage';
import NotesPage from './pages/coachApp/notesPage';
import CalendarPage from './pages/coachApp/calendarPage';
import TrainingGroupsPage from './pages/coachApp/trainingGroupsPage';
import ChatPage from "./pages/chat/chatPage"

//page for individual group
import TrainingGroupPage from './pages/trainingGroups/TrainingGroupPage';
import WorkoutPlanPage from './pages/coachApp/workoutPlanPage';

import isMobile from './checkDeviceFunction/isMobile';

// import the app config file
import './config';

//APP THEMES (DARK AND LIGHT)
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

function App(props) {

  // //useEffect for loading user's preferences
  // useEffect(() => {
  //   //console.log(props.user)

  //   //load user's preferences from firebase firestore
  //   firebase.getCurrentUserPreferences(props.setUserPreferences)
  // }, [props.user])

  // console.log(props.userPreferences)

  // //useEffect for setting the app theme
  // useEffect(()=> {
  //   //props.setTheme(props.userPreferences.appTheme)
  // }, [props.userPreferences.appTheme])

  //Initial useEffect (called only once), attach the user listener and set the device type (click or touch)
  useEffect(() => {
    //set the isTouchabe (from isTouchable function) to redux
    props.setIsMobile(isMobile())

    //attach a listener for user (get user's public information)
    firebase.getCurrentUser(props.setUser)
  }, [])

  // screen size event listener
  useEffect(()=>{
    window.addEventListener('resize', onScreenSizeChange);
  }, [])

  // function which changes isMobile in redux state if the screen size changes to mobile or desktop
  function onScreenSizeChange(e){
    const width = e.currentTarget.innerWidth
    
    if (width < global.config.app.responsiveThreshold){
      // mobile device

      props.setIsMobile(true)

     
    }else{
      // desktop device

      props.setIsMobile(false)

    }
  }

  return (
    <ThemeProvider theme={props.theme.colorMode === "dark" ? DarkTheme : LightTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Navbar><HomePage/></Navbar>} />
          <Route exact path="/login" render={() => <Navbar><SignInPage/></Navbar>} />
          <Route exact path="/signup" render={() => <Navbar><SignUpPage/></Navbar>} />

          {/* SPORTSMAN APP ROUTES*/}
          <Route exact path="/sportsmanApp/userId=:userId" render={() => <Navbar><SportsmanApp /></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/profile" render={() => <Navbar><SportsmanProfile /></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/training-groups" render={() => <Navbar><TrainingGroupsPage type="SPORTSMAN"/></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/training-groups/groupId=:groupId" render={() => <Navbar><TrainingGroupPage type="SPORTSMAN"/></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/chats" render={() => <Navbar><ChatPage/></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/calendar" render={() => <Navbar><CalendarPage/></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/notes" render={() => <Navbar><NotesPage/></Navbar>} />
          <Route exact path="/sportsmanApp/userId=:userId/workouts" render={() => <Navbar><WorkoutsPage/></Navbar>} />

          {/* COACH APP ROUTES*/}
          <Route exact path="/coachApp/coachId=:coachId" render={() => <Navbar><CoachApp /></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/profile" render={() => <Navbar><CoachProfile /></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/workouts" render={() => <Navbar><WorkoutsPage/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/notes" render={() => <Navbar><NotesPage/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/calendar" render={() => <Navbar><CalendarPage/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/training-groups" render={() => <Navbar><TrainingGroupsPage type="COACH"/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/training-groups/groupId=:groupId" render={() => <Navbar><TrainingGroupPage type="COACH"/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/chats" render={() => <Navbar><ChatPage/></Navbar>} />
          <Route exact path="/coachApp/coachId=:coachId/workout-plans/planId=:planId" render={() => <Navbar><WorkoutPlanPage/></Navbar>} />

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
    user: state.user,
    userPreferences: state.userPreferences
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIsMobile: (val) => dispatch({ type: "ISMOBILE/SET", payload: val }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    setUserPreferences: (obj) => dispatch({type: "USER/LOAD-PREFERENCES", payload: obj})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
