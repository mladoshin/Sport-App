import React from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Paper, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from "react-router-dom"
import firebase from '../../firebase/firebase'
import DirectionsRunRoundedIcon from '@material-ui/icons/DirectionsRunRounded';
import FitnessCenterRoundedIcon from '@material-ui/icons/FitnessCenterRounded';
import PoolRoundedIcon from '@material-ui/icons/PoolRounded';
import SportsFootballRoundedIcon from '@material-ui/icons/SportsFootballRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';


const useStyles = makeStyles((theme) => ({
    cardPaper: {
        height: "100%",
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
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
    nameText: {
        flexGrow: 1, 
        marginLeft: 5
    },
    updateBtn: {
        minWidth: 0, 
        width: 36, 
        borderColor: "#4caf50", 
        marginRight: 15
    }
}));

const CategoryIcon = (props) => {
    const width = props.width
    const height = props.height
    if (props.category === "running" || props.category === "athletics") {
        return <DirectionsRunRoundedIcon style={{width: width, height: height}}/>
    } else if (props.category === "weightlifting") {
        return <FitnessCenterRoundedIcon style={{width: width, height: height}}/>
    } else if (props.category === "swimming") {
        return <PoolRoundedIcon style={{width: width, height: height}}/>
    } else {
        return <SportsFootballRoundedIcon style={{width: width, height: height}}/>
    }
}

function HeaderCard(props) {
    const classes = useStyles()
    const name = props.goal.name
    const category = props.goal.category
    const variant = props.goal.variant
    //const icon = categoryIcon(category)
    const goalId = props.goal.id

    console.log("props.isMobile = "+props.isMobile)

    return (
        <Paper className={classes.cardPaper}>
            <CategoryIcon width={40} height={40} category={category}/>
            <Typography variant={variant} className={classes.nameText}>{name}</Typography>

            <Button variant="outlined" className={classes.updateBtn} onClick={()=>props.setOpenQuickModal({currentValue: props.goal.currentValue, units: props.goal.units, id: props.goal.id, startValue: props.goal.startValue, targetValue: props.goal.targetValue, name: props.goal.name, currentRepsValue: props.goal.currentRepsValue})}>
                <AddRoundedIcon/>
            </Button>
            
            {!props.isMobile ? <Button variant="outlined" color="secondary" onClick={()=>props.history.push("/dashboard/userId="+firebase.getCurrentUserId()+"/goals/"+category+"/goalId="+goalId)}>Show</Button> : null}
        </Paper>
    )
}

export default withRouter(HeaderCard);