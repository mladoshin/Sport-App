import React, {useState, useEffect} from "react"
import { connect } from 'react-redux'
import {Paper, Typography, CssBaseline} from '@material-ui/core'
import { Container } from '@material-ui/core';
import {withRouter} from "react-router-dom"
import NavBar from "../../components/navigation/navbar"
import HomeNavbar from "../../components/navigation/homeNavbar"
import firebase from '../../firebase/firebase';

function HomePage(props){
    
    return(
        <React.Fragment>
            <HomeNavbar goToPage={props.history.push}/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Typography variant="h3">This is home page!</Typography>
            </Container>
            
        </React.Fragment>
        
    );
}

const mapStateToProps = state => {
    return {
      user: state.user
    }
  }
  
  /*const mapDispatchToProps = dispatch => {
    return {
      setIsTouchable: (val) => dispatch({ type: "ISTOUCHABLE/SET", payload: val }),
      setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
      setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj })
    }
  }*/

export default connect(mapStateToProps, null)(withRouter(HomePage));