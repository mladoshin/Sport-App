import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, IconButton, Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import firebase from '../../firebase/firebase'
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import DirectionsRunRoundedIcon from '@material-ui/icons/DirectionsRunRounded';
import FitnessCenterRoundedIcon from '@material-ui/icons/FitnessCenterRounded';
import PoolRoundedIcon from '@material-ui/icons/PoolRounded';
import SportsFootballRoundedIcon from '@material-ui/icons/SportsFootballRounded';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  listItem_Text: {
    fontWeight: 500
  }, 
  DrawerSubheading: {
    textAlign: "center", 
    fontWeight: 700, 
    padding: "8px 0px 8px 0px"
  },
  logo: {
    flexGrow: 1,
    textAlign: "center"
  }
}));


function MUIDrawer(props) {
  const classes = useStyles();
  const drawerVariant = props.drawerVariant ? props.drawerVariant : "persistent";
  const categories = props.categories

  const DashboardLink = (
    <List>
      <ListItem button key="signin" onClick={() => props.history.replace("/dashboard/userId=" + firebase.getCurrentUserId())}>
        <ListItemIcon>
          <DashboardRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </List>
  )

  const AuthLinks = (
    <List>
      <ListItem button key="signin" onClick={() => props.history.push("/signin")}>
        <ListItemIcon>
          <MailIcon />
        </ListItemIcon>
        <ListItemText primary="Sign In" />
      </ListItem>

      <ListItem button key="signup" onClick={() => props.history.push("/signup")}>
        <ListItemIcon>
          <MailIcon />
        </ListItemIcon>
        <ListItemText primary="Sign Up" />
      </ListItem>
    </List>
  )

  const categoryItem = (category) => {
    if (category === "running" || category === "athletics") {
      return <DirectionsRunRoundedIcon />
    } else if (category === "weightlifting") {
      return <FitnessCenterRoundedIcon />
    } else if (category === "swimming") {
      return <PoolRoundedIcon />
    } else {
      return <SportsFootballRoundedIcon />
    }
  }

  const recentItems = props.recentItems.map((item, index) => {
    const date = new Date(item.dateCreated).toLocaleDateString()
    const icon = categoryItem(item.category)
    return (
      <ListItem button key={index} onClick={() => listItemClickHandler(item, "goal")}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText className={classes.listItem_Text} primary={item.name} />
        <Typography variant="body2">{date}</Typography>
      </ListItem>
    )
  })

  const listItemClickHandler = (item, type) => {
    if (type === "category") {
      props.history.push("/dashboard/userId=" + firebase.getCurrentUserId() + "/goals/" + item + "/filter=none")
    } else if (type === "goal") {
      props.history.push("/dashboard/userId=" + firebase.getCurrentUserId() + "/goals/" + item.category + "/goalId=" + item.id)
    }

    props.setDrawerOpen(false)
  }

  const categoriesKeys = Object.keys(categories)
  const content = Object.values(categories)
  
  const categoriesItems = categoriesKeys.map((item, index) => {
    const name = item.slice(0, 1).toUpperCase() + item.slice(1)
    const icon = categoryItem(item)
    return (
      <ListItem button key={index} onClick={() => listItemClickHandler(item, "category")}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={name} secondary={content[index].completedCount+"/"+content[index].count}/>
      </ListItem>
    )
  })

  const drawerElements = (
    <React.Fragment>
      {props.auth ?
        <div>
          {DashboardLink}
          <Divider />

          <Typography variant="h5" className={classes.DrawerSubheading}>Recent Goals</Typography>
          <Divider />
          <List>
            {recentItems}
          </List>

          <Divider />
          <Typography variant="h5" className={classes.DrawerSubheading}>Categories</Typography>
          <Divider />
          <List>
            {categoriesItems}
          </List>
        </div>
        :
        <div>
          <List>
            <ListItem button key="home" onClick={() => props.history.push("/home")}>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
          <Divider />
          {AuthLinks}
        </div>
      }


    </React.Fragment>
  )

  return (
    <Drawer
      className={classes.drawer}
      variant={drawerVariant}
      anchor="left"
      open={props.drawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Typography variant="h4" className={classes.logo}>SG</Typography>
        <IconButton onClick={() => props.setDrawerOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      {drawerElements}
    </Drawer>
  );
}

export default withRouter(MUIDrawer);