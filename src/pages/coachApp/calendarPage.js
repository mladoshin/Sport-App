import React from "react"
import { connect } from "react-redux"
import { Container, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import AddIcon from '@material-ui/icons/Add';

import TodoCalendar from "../dailyTodos/App"

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
    },
    searchBtn: {
        height: 45
    },
    searchInput: {
        height: "45px",
        boxSizing: "border-box"
    }

}));


function CalendarPage(props) {
    const classes = useStyles();
    return (
        <>
            <Container className={classes.mainContainer} maxWidth="xl">
                <h1>Calendar Page</h1>
                <TodoCalendar/>
                

            </Container>

        </>
    )
}

export default CalendarPage;