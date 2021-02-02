import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: "30px 0px 0px 0px"
  },
  gridItem: {
    padding: "1em"
  },
  upcomingDeadlinesCard: {
    height: 300,
    padding: 20
  },
  card: {
    [theme.breakpoints.up("md")]: {
      height: "40vh"
    }
  },
  chartCard: {
    height: 400,
    padding: 20,
    [theme.breakpoints.up("md")]: {
      height: "40vh"
    }
  },
  card1: {
    minHeight: 300,
    [theme.breakpoints.up("md")]: {
      height: "30vh"
    },
    overflowY: "scroll"
  }

}));





function CoachApp(props) {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const { coachId } = useParams();
  const classes = useStyles();

  useEffect(() => {
    //console.log("useEffect started")
    if (!isFirebaseInit) {
      
      firebase.isInit().then(val => {
        setIsFirebaseInit(true)
        console.log("useEffect started")
        console.log(firebase.auth.currentUser)
        //getting the user's IdToken
        if (firebase.getCurrentUserId()){
          //if user is logged in
          firebase.auth.currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            console.log(idTokenResult.claims)
          })
          .catch((error) => {
            console.log(error);
          });
        }else{
          //if user is not authorized
          console.log("No auth!")
          props.history.replace("/")
        }
        

      })
    }
  }, [isFirebaseInit])

  

  function authCheck(urlId, userId) {
    console.log(urlId, userId)
    if (urlId !== userId) {
      return false
    }
    return true
  }

  return (
    <React.Fragment>
 
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <h1>Coach App</h1>
        <Suspense fallback={null}>
          <h3>Welcome </h3>
        </Suspense>
        <button onClick={()=>{
          firebase.logout()
          props.history.replace("/")
          }}>Logout</button>
      </Container>

      

    </React.Fragment>

  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    theme: state.theme,
    goals: state.goals,
    goalCategories: state.goalCategories
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(null, null)(withRouter(CoachApp));