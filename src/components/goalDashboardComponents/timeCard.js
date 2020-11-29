import React from "react"
import { Paper, Typography, LinearProgress, Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cardPaper: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up("xs")]: {
            padding: 5
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
    center: {
        textAlign: "center"
    },
    progressBar: {
        height: 10,
        borderRadius: 5
    }

}));

function TimeCard(props) {
    const classes = useStyles()
    const deadline = props.deadline
    const dateCreated = props.dateCreated
    const timeProgress = deadline - Date.now() > 0 ? Math.floor((Date.now() - dateCreated) / (deadline - dateCreated) * 100) : 100

    const timeConvert = (1000 * 60 * 60 * 24) //to days
    const timePassed = deadline - Date.now() > 0 ? Math.floor(new Date(Date.now() - dateCreated).getTime() / timeConvert) : null
    const timePeriod = deadline - Date.now() > 0 ? Math.floor(new Date(deadline - dateCreated).getTime() / timeConvert) : null
    const timeLeft = Math.floor(timePeriod - timePassed)

    return (
        <Paper className={classes.cardPaper}>

            <Grid container style={{ flexGrow: 1 }}>

                {!props.isMobile ?
                    <React.Fragment>

                        <Grid item xs className={classes.center}>
                            <Typography variant="h5">Days left:</Typography>
                            <Typography variant="body2">{timeLeft >= 0 ? timeLeft : "null"}</Typography>
                        </Grid>

                        <Grid item xs className={classes.center}>
                            <Typography variant="h5">Deadline:</Typography>
                            <Typography variant="body2">{new Date(deadline).toLocaleDateString()}</Typography>
                        </Grid>

                        <Grid item xs className={classes.center}>
                            <Typography variant="h5">Created:</Typography>
                            <Typography variant="body2">{new Date(dateCreated).toLocaleDateString()}</Typography>
                        </Grid>
                    </React.Fragment>
                    :
                    null
                }
            </Grid>

            <Box display="flex" alignItems="center">
                <Box minWidth={45}>
                    <Typography variant="body2" color="textSecondary">{timePassed == null || timePeriod == null ? null : timePassed+"/"+timePeriod}</Typography>
                </Box>
                <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={timeProgress} color="primary" className={classes.progressBar} />
                </Box>
                <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{timeProgress}%</Typography>
                </Box>
            </Box>

        </Paper>
    )
}

export default TimeCard;