//<-----------------------CHAT PAGE----------------------->//
import React from "react"
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';


// Import the chat component
import ChatComponent from "./chatApp"


//styles
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: "0px 0px 0px 0px",
        height: "100%"
    }
}));


function ChatPage(props) {
    const classes = useStyles();

    return (
        <>
            <Container className={classes.mainContainer} maxWidth="xl">

                {/* Chat component */}
                <ChatComponent/>

            </Container>


        </>
    )
}

export default ChatPage;