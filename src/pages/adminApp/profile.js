/*-----------------------------PAGE FOR ADMIN'S PROFILE-----------------------------*/
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';


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




//Admin profile page component
function AdminProfile(props) {
  const [openDrawer, setOpenDrawer] = useState(false)
  const classes = useStyles();

  return (
    <React.Fragment>
      
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <h1>Admin Profile</h1>
        <Suspense fallback={null}>
          <h3>{props.user.displayName}</h3>
          <h4>Email: "{props.user.email}"</h4>
        </Suspense>
      </Container>



    </React.Fragment>

  );
}

const mapStateToProps = state => {
  return {
    user: state.user
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminProfile));