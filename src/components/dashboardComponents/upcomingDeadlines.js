import React from "react"
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import HeaderCard from "../goalDashboardComponents/headerCard"


const useStyles = makeStyles((theme) => ({
    OutterGrid: {
        flexDirection: "column"
    }
  }));


function UpcomingDeadlines(props) {
    const classes = useStyles()
    console.log(props.items)
    const maxElements = 5
    var count = 0
    const deadlineItems = props.items.slice(0, maxElements).map((item, i) => {
        var date = new Date(item.deadline).toDateString()
        return (
            <Grid item xs={12} key={i}>
                <HeaderCard goal={item} variant="h4" setOpenQuickModal={props.setOpenQuickModal} openQuickModal={props.openQuickModal}/>
            </Grid>
        )

    })
    return (
        <Grid container spacing={2} className={classes.OutterGrid}>
            {deadlineItems}
        </Grid>
    )
}

export default UpcomingDeadlines;