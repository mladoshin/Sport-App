//<-----------------------TRAINING GROUPS PAGE (WORKOUT BUILDER)----------------------->//
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
import TrainingGroupsComponent from "../trainingGroups/trainingGroups"

import Paper from '@material-ui/core/Paper';

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
    },
    searchBtn: {
        height: 45
    },
    searchInput: {
        height: "45px",
        boxSizing: "border-box"
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

}));

function GroupGrid(props) {

    const groupsItems = props.groups.map((group, index) => {
        return(
            <Grid item xs={2} style={{height: 200}}>
                <Paper style={{height: "100%"}}>
                    <h1>Group name</h1>
                    <Button>Open</Button>
                </Paper>
            </Grid>
        )
    })

    return (
        <Grid container spacing={2}>
            {groupsItems}
        </Grid>
    )
}


function TrainingGroupsPage(props) {
    const classes = useStyles();

    //function for adding new training groups
    function handleAddGroup(){

    }

    return (
        <>
            <Container className={classes.mainContainer}>
                <h1>Training groups Page</h1>

                <div style={{ height: 45 }}>
                    <TextField id="outlined-basic" label="Search for training groups" variant="outlined" style={{ height: "100%" }}
                        inputProps={{
                            style: {
                                height: 45,
                                boxSizing: "border-box"
                            }
                        }}
                        InputLabelProps={{
                            style: {
                                top: -6

                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.searchBtn}
                        startIcon={<SearchRoundedIcon />}
                    >
                        Search
                </Button>
                </div>
                
                <TrainingGroupsComponent/>
                

            </Container>


        </>
    )
}

export default TrainingGroupsPage;