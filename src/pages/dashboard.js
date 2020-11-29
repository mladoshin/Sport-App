import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card } from '@material-ui/core'
import NavBar from "../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../firebase/firebase';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import QuickModal from "../components/quickResultUpdateModal/quickModal"
import GoalModal from '../components/goalModal/goalModal'
import ProgressOverview from '../components/dashboardComponents/progressOverview'
import CategoryChart from "../components/dashboardComponents/categoriesChart";
import UpcomingDeadlines from "../components/dashboardComponents/upcomingDeadlines"

import clsx from "clsx"
import AddTooltip from "../components/tooltip/tooltip";
import DialogComponent from "../components/DialogComponent/dialog";

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





function DashboardPage(props) {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const { userid } = useParams();
  const classes = useStyles();
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openQuickModal, setOpenQuickModal] = useState(false)

  useEffect(() => {
    if (!isFirebaseInit) {
      firebase.isInit().then(val => {
        setIsFirebaseInit(true)
        if (authCheck(userid, firebase.getCurrentUserId())) {
          firebase.loadNotifications(props.loadNotifications) //load notifications
          firebase.loadUserGoals(props.loadGoals, props.loadCategories)
          props.loadAvatar(firebase.auth.currentUser.photoURL)
        } else {
          props.history.replace("/404")
        }
      })
    }
  }, [isFirebaseInit])

  function deadlineSort(a, b) {
    let comparison = 0
    console.log(a.deadline, b.deadline)
    if (a.category < b.category) {
      comparison = -1
    }
    if (a.category > b.category) {
      comparison = 1
    }
    if (comparison == 1) {
      console.log("Swap")
    }
    return comparison
  }

  var completedGoals = 0
  if (props.goals) {
    console.log(props.goals)

    try {
      props.goals.map((goal, i) => {
        if (goal.isCompleted) {
          completedGoals++
        }
      })
    } catch (err) {

    }

  }

  var sortedGoals = []
  try {
    props.goals.map((goal, iindex) => {
      if (!goal.isCompleted) {
        sortedGoals.push(goal)
      }
    })
  } catch (err) { }

  sortedGoals.sort((a, b) => a.deadline - b.deadline)



  console.log(sortedGoals)

  const percent = isFirebaseInit ? Math.floor(completedGoals / props.goals.length * 100) : 0
  const fraction = isFirebaseInit ? completedGoals + "/" + props.goals.length : 0

  function authCheck(urlId, userId) {
    console.log(urlId, userId)
    if (urlId !== userId) {
      return false
    }
    return true
  }

  return (
    <React.Fragment>
      <NavBar />
      <Container component="main" maxWidth="xl" className={classes.mainContainer}>
        <CssBaseline />
        <Grid container>
          {/*   1st Row   */}
          <Grid item xs={false} sm={false} md={1} lg={2} xl={2}></Grid>

          {/*   Progress Bar Card    */}
          <Grid item xs={12} sm={12} md={4} lg={3} xl={3} className={classes.gridItem}>
            <Card className={classes.card} elevation={3}>
              <ProgressOverview percent={percent} fraction={fraction} />
            </Card>
          </Grid>

          {/*   Category Chart Card    */}
          <Grid item xs={12} sm={12} md={6} lg={5} xl={5} className={classes.gridItem}>
            <Card className={classes.chartCard} elevation={3}>
              <CategoryChart categories={props.goalCategories} />
            </Card>
          </Grid>

          <Grid item xs={false} sm={false} md={1} lg={2} xl={2}></Grid>

          {/*   2nd Row   */}
          <Grid item xs={false} sm={false} md={1} lg={2} xl={2}></Grid>

          {/*   Upcoming Deadlines Card   */}
          <Grid item xs={12} sm={6} md={5} lg={4} xl={4} className={classes.gridItem}>
            <Card className={clsx(classes.upcomingDeadlinesCard, classes.card1)} elevation={3}>
              <UpcomingDeadlines items={sortedGoals} openQuickModal={openQuickModal} setOpenQuickModal={setOpenQuickModal}/>
            </Card>
          </Grid>

          {/*   Component for almost completed goals    */}
          <Grid item xs={12} sm={6} md={5} lg={4} xl={4} className={classes.gridItem}>
            <Card className={classes.card1} elevation={3}></Card>
          </Grid>

          <Grid item xs={false} sm={false} md={1} lg={2} xl={2}></Grid>

        </Grid>
      </Container>

      <AddTooltip setOpenAddModal={setOpenAddModal} />

      {/*   Modal for adding the new goal   */}
      <GoalModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
      {/*   Modal for adding the new goal  END   */}

      {openQuickModal ? <QuickModal setOpenQuickModal={setOpenQuickModal} openQuickModal={openQuickModal}/> : null}

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardPage));