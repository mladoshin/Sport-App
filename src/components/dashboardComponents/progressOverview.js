import React from "react"
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up("xs")]: {
            padding: 20
        },
        [theme.breakpoints.up("md")]: {
            padding: 10
        }
    },
    progressWrapper: {
        width: 300, 
        marginLeft: "auto", 
        marginRight: "auto",
        [theme.breakpoints.up("xs")]: {
            width: 300
        },
        [theme.breakpoints.up("md")]: {
            width: 250
        }
    },
    headerContainer: {
        textAlign: "center", 
        marginBottom: 20
    },
    bottomContainer: {
        textAlign: "center", 
        marginTop: 20
    }
  }));

function ProgressOverview(props) {
    const percent = props.percent
    const fraction = props.fraction
    const variant = props.variant
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>

            <div className={classes.headerContainer}> {/*Some Text Block*/}
                <Typography variant="h5">Progress Overview</Typography>
            </div>

            <div className={classes.progressWrapper}>   {/*Progress Bar Container*/}
                <CircularProgressbarWithChildren
                    value={percent}
                    text={fraction}
                    strokeWidth={10}
                    styles={buildStyles({
                        strokeLinecap: "butt"
                    })}
                >
                </CircularProgressbarWithChildren>
            </div>

            <div className={classes.bottomContainer}> {/*Some Text Block*/}
                <Typography>Hello, World!</Typography>
            </div>
        </div>
    )
}

export default ProgressOverview