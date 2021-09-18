import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, CircularProgress, Avatar } from '@material-ui/core'
import { withRouter, useParams } from "react-router-dom";
import firebase from '../firebase/firebase';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';

import { useDocumentData } from "react-firebase-hooks/firestore";

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
    avatar: {
        height: 300,
        width: 300
    }

}));




//sportsman app home page
function ProfilePage(props) {
    const { uid } = useParams();
    const classes = useStyles();

    const [userInfo, loading, error] = useDocumentData(firebase.fireDB.collection("users").doc(uid))

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])


    return (
        <React.Fragment>

            <Container component="main" maxWidth="xl" className={classes.mainContainer}>
                <h1>Page for user {uid}</h1>
                {!loading ? 
                    <center>
                        <Avatar src={userInfo?.photoURL} className={classes.avatar}/>
                        <div style={{ textAlign: "left", width: 300}}>
                            <h3>Role: {userInfo?.role}</h3>
                            <h3>Name: {userInfo?.name}</h3>
                            <h3>Surname: {userInfo?.surname}</h3>
                            <h3>Email: {userInfo?.email}</h3>
                        </div>
                        <Button color="primary" variant="contained" startIcon={<ChatBubbleRoundedIcon/>}>{"Message "+ userInfo?.name }</Button>  
                    </center>
                :
                    <Container>
                        <center>
                            <CircularProgress />
                        </center>
                    </Container>
                    }


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
        setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfilePage));