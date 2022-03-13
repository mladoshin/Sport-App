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
import './App.css';
import firebase from "../../firebase/firebase"

import LinearProgress from '@material-ui/core/LinearProgress';


import DayDialog from "./dayDialog"
import { Button, Typography } from '@material-ui/core'

let todayStr = new Date().toISOString().replace(/T.*$/, '')
// console.log(todayStr)

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


function TodoCalendar(props) {
  const userId = "jncnru2u934jd"
  const dayId = "vuhtru8gghdw"

  const [open, setOpen] = useState({payload: false, mode: "CREATE"})
  const [content, setContent] = useState([])
  const [habits, setHabits] = useState([])

  useEffect(()=>{
    console.log("Init the state")
    //firebase.addDayContent(userId, dayId, {name: "Plan", date: todayStr, content: "Hello World!"})
    firebase.getDayContent(props.user.uid, dayId, todayStr, setContent)
    firebase.getHabits(props.user.uid, setHabits)
  }, [props.user.uid])

  console.log(habits)

  useEffect(()=>{
    let els = document.getElementsByClassName("fc-daygrid-day")
    //console.log(els)

    let els_array = Object.values(els)

    content.forEach((item, index) => {
      els_array.forEach((el, index) => {
        if(el.dataset.date == item.start){
          el.style.backgroundColor = "green"
        }
      })
    })

  }, [content])

  console.log(content)

  function renderEventContent(eventInfo) {
    console.log(eventInfo.event.startStr)
    eventInfo.backgroundColor = "orange"
    let habitNum = 0

    //find the total number of habits in single day
    habits.forEach((habit, index) => {
      if(habit.type == "daily" && habit.startDate <= eventInfo.event.startStr){
        habitNum++
      }else if(habit.type == "weekly" && habit.startDate <= eventInfo.event.startStr){
        let weekDay = new Date(eventInfo.event.startStr).getDay()
        let habitDay = new Date(habit.startDate).getDay()

        if (weekDay == habitDay){
          habitNum++
        }

      }else if(habit.type == "monthly" && habit.startDate <= eventInfo.event.startStr){
        let dayDate = new Date(eventInfo.event.startStr).getDate()
        let habitDate = new Date(habit.startDate).getDate()
        if (dayDate == habitDate){
          habitNum++
        }
      }else if(habit.type == "custom"){
        //add processing for custom habit repetition (according to weekdays)
        let days = habit.days
        let dayWeekDay = new Date(eventInfo.event.startStr).getDay()
        if(days){
            if (days.indexOf(dayWeekDay)+1){
              habitNum++
            }
        }   
        
    }





    })

    return (
      <>
        <i>{eventInfo.event.title}</i>
        <p>Total habits: {habitNum}</p>
        <BorderLinearProgress variant="determinate" value={0}/>
      </>
    )
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
    console.log(clickInfo.dayEl)
    //clickInfo.dayEl.style.backgroundColor = "blue"
    console.log("Day clicked")
    let todayStr = new Date().toISOString().replace(/T.*$/, '')
    //firebase.addDayContent(userId, dayId, {name: "", date: clickInfo.dateStr})
    firebase.isDayContentEmpty(userId, "someId", clickInfo.dateStr).then(res => {
      console.log(res)
      if(res){
        setOpen({payload: clickInfo, mode: "CREATE"})
      }else{
        
        let name = ""
        let id = ""
        let completedHabits = 0
        content.forEach((item, index) => {
          if(item.start == clickInfo.dateStr){
            name = item.title
            id = item.id
            completedHabits = item.completedHabits ? item.completedHabits : 0
          }
        })
        setOpen({payload: clickInfo, mode: "WATCH", name: name, id: id, completedHabits: completedHabits})
      }
    })
    //setOpen({payload: clickInfo, mode: "CREATE"})
  } 

  //function for adding the new habit
  function handleAddHabit(){
    let name = window.prompt("Name of habit: ")
    let startDate = window.prompt("StartDate of habit: ")
    let type = window.prompt("Enter the type (daily, weekly, monthly, custom)")
    let habit = {
      name: name,
      startDate: startDate,
      type: type
    }
    if(type == "custom"){
      const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      let days = window.prompt("Enter the recurring days: ")
      let days_array = days.split(", ")
      let days_formatted_array = []

      days_array.forEach((day) => {
        console.log(day)
        days_formatted_array.push(weekDays.indexOf(day.toLowerCase()))
      })

      console.log(days_formatted_array)
      habit.days = days_formatted_array
    }
    console.log(habit)
    if(habit.type && habit.name && habit.startDate){
      firebase.addHabit(habit)
    }
    
  }

  console.log(open)

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
        /*eventContent={renderEventContent} // custom render function 
        
        eventClick={(e)=>handleEventClick(e)}
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

      <DayDialog open={open} setOpen={setOpen} habits={habits} handleAddHabit={handleAddHabit} nextDay={nextDay} previousDay={previousDay}/>
      <Button onClick={handleAddHabit}>Add Habit</Button>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(TodoCalendar);