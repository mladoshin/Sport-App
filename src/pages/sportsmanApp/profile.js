//<-----------------------page for the user's profile----------------------->//
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Avatar, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import UploadDialog from "../coachApp/uploadDialog"

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





function SportsmanProfile(props) {
  const classes = useStyles();

  //state for the dialog (avatar upload)
  const [fileDialogOpen, setFileDialogOpen] = useState(false)

  //function for handling the opening of a avatar upload dialog
  function handleAvatarUpload() {
    //set the dialog open state to true (open the dialog)
    setFileDialogOpen(true)
  }

  //function which changes the app theme in setting sub section in profile
  function handleThemeChange(e){
    console.log()
    if(e.target.checked){
      //set dark theme
      firebase.updateUserPreferences({appTheme: "dark"})
      //props.setTheme("dark")
    }else{
      //set light theme
      //props.setTheme("light")
      firebase.updateUserPreferences({appTheme: "light"})

    }
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <h1>Sportsman Profile</h1>
        <Avatar alt="avatar" src={props.user.photoURL} style={{ width: 200, height: 200 }} onClick={handleAvatarUpload} />
        <Suspense fallback={null}>
          <h3>{props.user.displayName}</h3>
          <h4>Email: "{props.user.email}"</h4>
        </Suspense>

        <h2>Settings</h2>
        <FormControlLabel
          control={
            <Switch
              checked={props.theme.colorMode == "dark"}
              onChange={handleThemeChange}
              name="checkedB"
              color="primary"
            />
          }
          label={props.theme.colorMode == "dark" ? "Light theme" : "Dark theme"}
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
    //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SportsmanProfile));