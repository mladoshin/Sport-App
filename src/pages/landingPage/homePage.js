// <----------  This is a landing page (Main page) at top level route "/" ---------->

import React from "react"
import {Container, Typography, CssBaseline} from '@material-ui/core'
import {withRouter} from "react-router-dom"

// Importing navbar for landing page
import HomeNavbar from "../../components/navigation/homeNavbar"

//Home page for landing page
function HomePage(props){  
    return(
        <React.Fragment>
            {/* Top navbar component */}
            <HomeNavbar goToPage={props.history.push}/>

            {/* Container for the site's content */}
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Typography variant="h3">This is home page!</Typography>
            </Container>
            
        </React.Fragment>
        
    );
}

export default withRouter(HomePage);