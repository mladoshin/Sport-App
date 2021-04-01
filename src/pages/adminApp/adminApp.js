import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import MiniDrawer from "../../components/navigation/desktopNavbar";
import MobileNavbar from "../../components/navigation/mobileNavbar";
import Navbar from "../../components/navigation/navbar";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: "30px 0px 0px 0px",
    transition: "padding-left 230ms ease-out"
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





function AdminApp(props) {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    firebase.getAllUsers().then(res => setUsers(res.data))
  }, [])

  /*useEffect(() => {
    //console.log("useEffect started")
    if (!isFirebaseInit) {

      firebase.isInit().then(val => {
        setIsFirebaseInit(true)
        console.log("useEffect started")
        console.log(firebase.auth.currentUser)
        //getting the user's IdToken
        if (firebase.getCurrentUserId()) {
          //if user is logged in
          firebase.auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
              //console.log(idTokenResult.claims.coach)
              if (idTokenResult.claims.role !== "ADMIN") {
                throw new Error("No auth!")
              }
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
              console.log(userInfo)
              props.setUser(userInfo)

            })
            .catch((error) => {
              console.log(error);
              props.history.replace("/404")
            });

        } else {
          //if user is not authorized

          props.history.replace("/")
          alert("No Auth!")
        }
      })
    }
  }, [isFirebaseInit])*/


  console.log(props.user)
  //console.log(array)

  console.log(users)
  var userList = users.map(user => {
    return (
      <div style={{ border: "1px solid black", marginTop: 20 }}>
        <h1>Name: {user.name} {user.surname}</h1>
        <h2>Email: {user.email} </h2>
        <h3>City: {user.city} </h3>
        <h3>ID: {user.uid}</h3>
      </div>
    )
  })

  return (
    <React.Fragment>
      {/*<MiniDrawer open={openDrawer} setOpen={setOpenDrawer}/>*/}
      {/*<Navbar/>*/}
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <h1>Admin App</h1>
        <Suspense fallback={null}>
          <h3>Welcome, Admin!</h3>
          <h4>Email: "{props.user.email}"</h4>
        </Suspense>


        <button onClick={() => {
          firebase.logout()
          props.history.replace("/")
        }}>Logout</button>
      </Container>

      {userList}

    </React.Fragment>

  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    mobile: state.isTouchable,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    setContentShift: (val) => dispatch({ type: "THEME/CONTENT_SHIFT", payload: val })
    //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminApp));