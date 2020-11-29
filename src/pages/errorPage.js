import React from "react"

function ErrorPage(props){

    const errorDefault = {
        code: "404",
        message: "The path does not exist!"
    }

    return(
        <React.Fragment>
            <h1>Error {props.error ? props.error.code : errorDefault.code}</h1>
            <h3>{props.error ? props.error.message : errorDefault.message}</h3>
        </React.Fragment>
        
    );
}

export default ErrorPage;