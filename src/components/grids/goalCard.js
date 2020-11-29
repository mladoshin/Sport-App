import React, { useContext, useState, useEffect} from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core'
import { withRouter } from "react-router-dom"

import ProgressCard from '../goalDashboardComponents/progressCard'
import HeaderCard from '../goalDashboardComponents/headerCard'
import TimeCard from '../goalDashboardComponents/timeCard'

import ModalContext from '../newGoalModal/context/quickModalContext'
import firebase from "../../firebase/firebase"

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        [theme.breakpoints.up("xs")]: {
            padding: 10
        },
        [theme.breakpoints.up("sm")]: {
            padding: 15
        },
        [theme.breakpoints.up("md")]: {
            padding: 20
        },
        [theme.breakpoints.up("lg")]: {
            padding: 25
        }
    },
    cardPaper: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
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
    mainContainer: {
        width: "100%",
        [theme.breakpoints.up("xs")]: {
            padding: "0px 5px 0px 5px"
        },
        [theme.breakpoints.up("sm")]: {
            padding: "0px 15px 0px 15px"
        },
        [theme.breakpoints.up("md")]: {
            padding: "0px 8.3% 0px 8.3%"
        },
        [theme.breakpoints.up("lg")]: {
            padding: "0px 16.6% 0px 16.6%"
        }
    },
    sideGridContainer: {
        [theme.breakpoints.up("xs")]: {
            padding: "10px 10px 10px 0px"
        },
        [theme.breakpoints.up("sm")]: {
            padding: "15px 15px 15px 0px"
        },
        [theme.breakpoints.up("md")]: {
            padding: "20px 20px 20px 0px"
        },
        [theme.breakpoints.up("lg")]: {
            padding: "25px 25px 25px 0px"
        }
    },
    sideGridItem: {
        [theme.breakpoints.up("xs")]: {
            marginBottom: 10
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: 15
        },
        [theme.breakpoints.up("md")]: {
            marginBottom: 20
        },
        [theme.breakpoints.up("lg")]: {
            marginBottom: 20
        }
    },
    circularProgress: {
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.up("xs")]: {
            width: "90%"
        },
        [theme.breakpoints.up("sm")]: {
            width: "85%"
        },
        [theme.breakpoints.up("md")]: {
            width: "70%"
        },
        [theme.breakpoints.up("lg")]: {
            width: "60%"
        }
    },
    paper: {
        width: "100%",
        height: "100%"
    }
}));

function GoalsCard(props) {
    const [isMobile, setIsMobile] = useState(false)

    const modal = useContext(ModalContext)
    //console.log(modal)
    const classes = useStyles()
    const goal = props.goal;

    const startValue = parseFloat(goal.startValue)
    const currentValue = parseFloat(goal.currentValue)
    const targetValue = parseFloat(goal.targetValue)

    const isDeadlineCard = props.isDeadlineCard ? true : false
    
    const progress = goal.progress; //progress of the goal

    //Window resize logic for better responsiveness
    useEffect(()=>{
        window.addEventListener("resize", ()=>handleResize())      
    })

    useEffect(()=>{
        handleResize()
    }, [])

    function handleResize(){
        if(window.innerWidth < 600){
            if(!isMobile){
                setIsMobile(true)
            }
        }else{
            if(isMobile){
                setIsMobile(false)
            }
        }
    }
    //Window resize logic for better responsiveness END

    function handleClick(){
        if(isMobile){
            props.history.push("/dashboard/userId="+firebase.getCurrentUserId()+"/goals/"+goal.category+"/goalId="+goal.id)
        }
        console.log("Click")
    }

    console.log(isMobile)

    
    //console.log(startValue, currentValue, targetValue)
    //console.log("Fraction: " + progress)
    //console.log("Percent: " + progressPercent)

    return (
        <Paper className={classes.paper} elevation={3} onClick={()=>handleClick()}>
            <Grid item container direction="row" style={{height: "100%"}}>
                {/*     Progress Card Component     */}
                <Grid item xs={4} className={classes.gridContainer} style={{height: "100%"}}>
                    <ProgressCard percent={Math.floor(progress)} currentValue={goal.currentValue} targetValue={goal.targetValue} units={goal.units} isMobile={isMobile}/>  {/* Progress card component for displaying the progress on the goal */}
                </Grid>
                {/*     Progress Card Component END     */}

                
                <Grid item container direction="column" xs={8} justify="space-between" className={classes.sideGridContainer} style={{flexWrap: "nowrap", height: "100%"}}>
                    {/*     Header Card Component     */}
                    <Grid item className={classes.sideGridItem}>
                        <HeaderCard goal={goal} variant="h4" setOpenQuickModal={modal.setOpenQuickModal} openQuickModal={modal.openQuickModal} isMobile={isMobile}/>
                    </Grid>
                    {/*     Header Card Component END    */}

                    {/*     Time Card Component     */}
                    <Grid item style={{ flexGrow: 1 }}>
                        <TimeCard deadline={goal.deadline} dateCreated={goal.dateCreated} isMobile={isMobile}/>
                    </Grid>
                    {/*     Time Card Component END    */}

                </Grid>
            </Grid>
        </Paper>
    )
}

export default withRouter(GoalsCard);