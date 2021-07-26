//page for the coach's profile
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import UploadDialog from "./uploadDialog"

//styles
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


function CoachProfile(props) {
  //state for the dialog (avatar upload)
  const [fileDialogOpen, setFileDialogOpen] = useState(false)
  //state for appTheme
  const [darkTheme, setDarkTheme] = useState(props.theme.colorMode==="dark" ? true : false)

  const classes = useStyles();
  //console.log(props.user.photoURL)

  //function for handling the opening of a avatar upload dialog
  function handleAvatarUpload() {
    //set the dialog open state to true (open the dialog)
    setFileDialogOpen(true)
  }

  //function for changing the app theme
  function handleThemeChange(e){
    setDarkTheme(e.target.checked)
    if(e.target.checked){
      //set dark theme
      props.setTheme("dark")
    }else{
      //set light theme
      props.setTheme("light")
    }
  }

  console.log(props.theme)


  return (
    <React.Fragment>
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <h1>Coach Profile</h1>
        <Avatar alt="avatar" src={props.user.photoURL} style={{ width: 200, height: 200 }} onClick={handleAvatarUpload} />
        <Suspense fallback={null}>
          <h3>{props.user.displayName}</h3>
          <h4>Email: "{props.user.email}"</h4>
        </Suspense>
        <h2>Settings</h2>
        <FormControlLabel
          control={
            <Switch
              checked={darkTheme}
              onChange={handleThemeChange}
              name="checkedB"
              color="primary"
            />
          }
          label={darkTheme ? "Light theme" : "Dark theme"}
        />
      </Container>


      <UploadDialog open={fileDialogOpen} handleClose={() => setFileDialogOpen(false)} />
    </React.Fragment>

  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CoachProfile));