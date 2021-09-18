import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

  const [value, setValue] = React.useState("ALL");



  useEffect(() => {
    firebase.getAllUsers({ role: value }, setUsers)
  }, [value])

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function handleGoToProfile(uid){
    console.log("Going to the user's profile with id: "+uid)
    props.history.push("/adminApp/viewUserProfile/userId="+uid)
  }


  console.log(props.user)
  //console.log(array)

  console.log(users)
  var userList = users.map(user => {
    return (
      <div style={{ border: "1px solid black", marginTop: 20 }}>
        <h1>Name: {user.name} {user.surname}</h1>
        <h2>Email: {user.email} </h2>
        <h3>City: {user.geolocation && user.geolocation.city} </h3>
        <h3>Country: {user.geolocation && user.geolocation.country} </h3>
        <h3>User's IP: {user.geolocation && user.geolocation.ip} </h3>
        <h3>ID: {user.id}</h3>
        <button onClick={()=>handleGoToProfile(user.id)}>Go to profile</button>
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
      <br/>
      <FormControl component="fieldset">
        <FormLabel component="legend">Sort:</FormLabel>
        <RadioGroup aria-label="sort" name="sort" value={value} onChange={handleChange}>
          <FormControlLabel value="COACH" control={<Radio />} label="Coaches" />
          <FormControlLabel value="SPORTSMAN" control={<Radio />} label="Athletes" />
          <FormControlLabel value="ALL" control={<Radio />} label="All" />
        </RadioGroup>
      </FormControl>

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