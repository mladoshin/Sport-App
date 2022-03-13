//<-----------------------CHAT PAGE----------------------->//
import React from "react"
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router";

// Import the chat component
import ChatComponent from "../components/chat/chatApp"


//styles
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: "0px 0px 0px 0px",
        height: "100%"
    }
}));


function ChatPage(props) {
    const classes = useStyles();
    const {userId} = useParams()

    console.log(userId)
    
    return (
        <>
            <Container className={classes.mainContainer} maxWidth="xl">

                {/* Chat component */}
                <ChatComponent type={props.type}/>

            </Container>


        </>
    )
}

export default ChatPage;