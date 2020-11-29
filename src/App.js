import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter, withRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

function App(props) {
  
  const DarkTheme = createMuiTheme({
    palette: {
      type: "dark"
    }
  })

  const LightTheme = createMuiTheme({
    palette: {
      type: "light"
    }
  })

  return (
    <ThemeProvider theme={props.theme === "dark" ? DarkTheme : LightTheme}>
      <BrowserRouter>
        <Switch>

          <Route exact path="/" render={()=><h1>HomePage</h1>}/>
          <Route exact path="/login" render={()=><h1>Login</h1>}/>
          <Route exact path="/coach-login" render={()=><h1>Coach Login</h1>}/>

        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

//const mapStateToProps = state => {

//}

//const mapDispatchToProps = dispatch => {
//  return {
//  }
//}


export default connect(null, null)(App);
