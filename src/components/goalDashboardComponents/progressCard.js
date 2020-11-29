import React from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cardPaper: {
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        [theme.breakpoints.up("xs")]: {
            padding: 5,
            justifyContent: "center"
        },
        [theme.breakpoints.up("sm")]: {
            padding: 10
        },
        [theme.breakpoints.up("md")]: {
            padding: 15
        },
        [theme.breakpoints.up("lg")]: {
            padding: 20
        }
    },
    circularProgress: {
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
        
        [theme.breakpoints.up("xs")]: {
            width: "95%",
            height: "auto",
            maxWidth: 120

        },
        [theme.breakpoints.up("sm")]: {
            width: "85%",
            height: "auto",
            marginTop: 10,
            marginBottom: 10,
            maxWidth: 130
        },
        [theme.breakpoints.up("md")]: {
            width: "85%",
            height: "auto",
            marginTop: 10,
            marginBottom: 10,
            maxWidth: 150
        },
        [theme.breakpoints.up("lg")]: {
            width: "80%",
            height: "auto",
            marginTop: 10,
            marginBottom: 10,
            maxWidth: 180
        }
    },
    bottomText: {
        textAlign: "center", 
        fontWeight: 600,

    }

}));

function ProgressCard(props) {
    const classes = useStyles()
    const progressPercent = props.percent
    const currentlValue = props.currentValue
    const targetValue = props.targetValue
    const units = props.units

    return (
        <Paper className={classes.cardPaper}>
            <div className={classes.circularProgress}>
                <CircularProgressbar value={progressPercent ? progressPercent : 0} text={progressPercent!==undefined ? progressPercent+"%" : "error"} styles={buildStyles({
                    pathColor: "#f50057",
                    textColor: "#f50057"
                })} />
            </div>

            {!props.isMobile ? <Typography variant="body1" className={classes.bottomText}>{currentlValue + units} / {targetValue + units}</Typography> : null}

        </Paper>
    )
}

export default ProgressCard;