import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button } from '@material-ui/core'
import GoalCard from './goalCard'
import Swipe from "react-easy-swipe";

import firebase from "../../firebase/firebase"

const useStyles = makeStyles((theme) => ({
    gridItem: {
        //display: "flex",
        //flexDirection: "row",
        //flexWrap: "nowrap",
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up("xs")]: {
            height: 160
        },
        [theme.breakpoints.up("sm")]: {
            height: 220
        },
        [theme.breakpoints.up("md")]: {
            height: 240
        },
        [theme.breakpoints.up("lg")]: {
            height: 300
        }
    },
    leftBlock: {
        width: 150,
        height: "100%",
        marginLeft: -150,
        backgroundColor: "#4caf50 !important",
        marginRight: theme.spacing(1),
        color: "white",
        fontSize: 20
    },
    rightBlock: {
        width: 150,
        height: "100%",
        marginRight: -150,
        backgroundColor: "#d32f2f !important",
        marginLeft: theme.spacing(1),
        color: "black",
        fontSize: 20
    }
}));

function GoalsGrid(props) {
    const classes = useStyles()
    const [isSwiped, setIsSwiped] = useState(0)
    const horizontalThreshold = 150
    const ySensitivity = 0.5
    var touchX = 0
    var touchY = 0

    function handleTouchMove(x, y, indx) {
        const id = "swipeContainer" + indx
        const griditem = document.getElementById(id)
        //console.log(x)
            touchY = Math.abs(y)
    
            const margin = isSwiped + x
            
            console.log("isSwiped+x = " + (margin))
            if (Math.abs(margin) > horizontalThreshold){
                if (margin > 0){
                    touchX = horizontalThreshold
                }else{
                    touchX = -1*horizontalThreshold
                }
            }else{
                touchX = isSwiped + x
            }


        console.log("Displacement x: "+x+"   Displacement y: "+y)
        if (Math.abs(y) < ySensitivity*Math.abs(x)){
            griditem.style.marginLeft = touchX + "px"
        }
        
    }

    function handleTouchEnd(indx){
        const id = "swipeContainer" + indx
        const griditem = document.getElementById(id)

        console.log("touch ended!")
        console.log(touchY)
        //console.log(isSwiped)
        if (Math.abs(touchX)>horizontalThreshold/2 && touchY < ySensitivity*horizontalThreshold/2){
            if (touchX>0){
                griditem.style.marginLeft = "150px"
                setIsSwiped(150)
            }else{
                griditem.style.marginLeft = "-150px"
                setIsSwiped(-150)
            }
            
        }else{
            griditem.style.marginLeft = "0px"
            setIsSwiped(0)
        }

        griditem.style.transition = "300ms ease-in-out"

        setTimeout(()=>{
            griditem.style.transition = "none"
        }, 500)

    }

    function handleSideBtnClick(type, goalId){
        if (type=="left"){
            firebase.completeGoal(goalId)
        }else if (type=="right"){
            firebase.deleteGoal(goalId)
        }
    }

    const content = props.goals.map((goal, index) => {
        return (

            <Grid item container xs={12} className={classes.gridItem} key={index} id={"swipeContainer" + index} style={{ flexWrap: "nowrap" }}>
                <Grid item>
                    <Button variant="outlined" className={classes.leftBlock} onClick={()=>handleSideBtnClick("left", goal.id)}>Complete</Button>
                </Grid>

                <Grid item xs={12} >
                    <Swipe onSwipeMove={(position, event) => handleTouchMove(position.x, position.y, index)} onSwipeEnd={() => handleTouchEnd(index)} style={{ height: "100%" }}>
                        <GoalCard goal={goal} />
                    </Swipe>
                </Grid>

                <Grid item>
                    <Button variant="outlined" className={classes.rightBlock} onClick={()=>handleSideBtnClick("right", goal.id)}>Delete</Button>
                </Grid>

            </Grid>

        )
    })

    return (
        <Grid container direction="column" spacing={0} style={{ boxSizing: "content-box", overflowX: "hidden" }}>
            {content}
        </Grid>
    )
}

export default GoalsGrid;