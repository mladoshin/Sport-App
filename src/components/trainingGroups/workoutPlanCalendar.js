//<-----------------------DAILY TODOS CALENDAR COMPONENT----------------------->//
import React, {useState, useEffect, useRef} from 'react'
import { connect } from "react-redux"
import { createPortal, render, hydrate } from "react-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from "@fullcalendar/list"
import firebase from "../../firebase/firebase"

import LinearProgress from '@material-ui/core/LinearProgress';


import WorkoutPlanCalendarDialog from "./workoutPlanCalendarDialog"
import { Button, Typography } from '@material-ui/core'

let todayStr = new Date().toISOString().replace(/T.*$/, '')
console.log(todayStr)

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

const init_content = [
    {
        title: "Workout1",
        start: "2021-04-19",
        allDay: true,
        id: 1
    },
    {
        title: "Workout2",
        start: "2021-04-20",
        allDay: true,
        id: 2
    },
    {
        title: "Workout3",
        start: "2021-04-21",
        allDay: true,
        id: 3
    }
]
function WorkoutPlanCalendar(props) {
  const userId = "jncnru2u934jd"
  const dayId = "vuhtru8gghdw"

  const [open, setOpen] = useState({payload: null, mode: "CREATE"})
  const [content, setContent] = useState(init_content)

  console.log(content)

  useEffect(()=>{
    console.log("Init the state")
    firebase.getDayWorkoutShortcutsFromPlan(props.group, props.planId, setContent)
  }, [props.user.uid])


  console.log(props.planId)

  function renderEventContent(eventInfo) {
    console.log(eventInfo.event.startStr)
    eventInfo.backgroundColor = "orange"
    let habitNum = 0   
  }

  function handleCellMount(e){
    let cellDateStr = e.date.toISOString().replace(/T.*$/, '')

    let id = "cell_"+cellDateStr
    e.el.children[0].id = id
  }

  function injectContent(args){
    return(
      <div style={{width: "100px"}}>
        <center><h3>{args.dayNumberText}</h3></center>
      </div>
      
    )
  }

  function findDayByDate(dateStr){
    let dayContent = {
      name: "",
      id: ""
    }

    content.forEach((item, index) => {
      if(item.start == dateStr){
        dayContent.name = item.title
        dayContent.id = item.id
      }
    })

    return dayContent

  }

  //function for selecting next day when the dialog is opened
  function nextDay(){
    let currrentDay = new Date(open.payload.dateStr).getDate()
    let nextDay = new Date()
    nextDay.setDate(currrentDay+1)
    let nextStr = new Date(nextDay).toISOString().replace(/T.*$/, '')
    console.log(nextStr)

    let nextDayContent = findDayByDate(nextStr)
    
    setOpen({payload: {dateStr: nextStr}, name: nextDayContent.name, id: nextDayContent.id, mode: "WATCH"})

  }

  //function for selecting previous day when the dialog is opened
  function previousDay(){
    let currrentDay = new Date(open.payload.dateStr).getDate()
    let prevDay = new Date()
    prevDay.setDate(currrentDay-1)
    let prevStr = new Date(prevDay).toISOString().replace(/T.*$/, '')
    
    let prevDayContent = findDayByDate(prevStr)
    setOpen({payload: {dateStr: prevStr}, name: prevDayContent.name, id: prevDayContent.id, mode: "WATCH"})
  }

  //function for opening a day content to watch, edit, or create
  function handleDateClick(clickInfo){
    console.log(clickInfo)
    //clickInfo.dayEl.style.backgroundColor = "blue"
    console.log("Day clicked")
    let todayStr = new Date().toISOString().replace(/T.*$/, '')
    //firebase.addDayContent(userId, dayId, {name: "", date: clickInfo.dateStr})
    let event = content.find(e => e.start === clickInfo.dateStr)
    console.log(event)
    
    if (event){
        setOpen({payload: {dateStr: clickInfo.dateStr, title: event.title}, mode: props.readOnly ? "VIEW" : "UPDATE/EDIT"})
    }else{
        setOpen({payload: {dateStr: clickInfo.dateStr, title: ""}, mode: props.readOnly ? "VIEW" : "CREATE"})
    }
    
  }

  function handleEventClick(e){
      console.log("Clicked the event!")
      console.log(e.event)
      const date = e.event.startStr
      const title = e.event.title
      if(props.readOnly){
        setOpen({payload: {dateStr: date, title: title}, mode: "VIEW"})
      }else{
        setOpen({payload: {dateStr: date, title: title}, mode: "UPDATE/EDIT"})
      }
      
  }

  

  //console.log(open)

  return (
    <div className="App">
      <FullCalendar
        themeSystem="bootstrap"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView='dayGridMonth'
        dayCellContent={injectContent}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={(e) => handleDateClick(e)}
        dayCellDidMount={(e) => handleCellMount(e)}
        
        events={content}
        eventAdd={(e)=>console.log("eventAdd")}
        eventContent={renderEventContent}
        eventClick={(e)=>handleEventClick(e)}
        /*eventContent={renderEventContent} // custom render function 
        
        
        select={(e)=>handleDateSelect(e)}
        eventAdd={(e)=>console.log("eventAdd")}*/
      /*weekends={this.state.weekendsVisible}
      initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
      
       // called after events are initialized/added/changed/removed
    you can update a remote database when these fire:
    
    eventChange={function(){}}
    eventRemove={function(){}}
    */
      />

    {open.payload ? <WorkoutPlanCalendarDialog open={open} setOpen={setOpen} addContent={(item)=>setContent([...content, item])} group={props.group} planId={props.planId}/> : null}
      
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
    setTheme: (theme) => dispatch({ type: "THEME/CHANGE", payload: theme }),
    //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
    //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
    //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPlanCalendar);