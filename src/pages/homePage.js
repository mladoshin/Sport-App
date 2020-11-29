import React, {useState, useEffect} from "react"
import {Paper, Typography, CssBaseline} from '@material-ui/core'
import { Container } from '@material-ui/core';
import {withRouter} from "react-router-dom"
import NavBar from "../components/navigation/navbar"
import firebase from '../firebase/firebase';

function HomePage(props){
    
    return(
        <React.Fragment>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Typography variant="h3">This is home page!</Typography>
            </Container>
            
        </React.Fragment>
        
    );
}

export default withRouter(HomePage);