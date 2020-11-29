import React, { useState, useEffect } from "react"
import { Typography, IconButton, Button, Step, Stepper, StepLabel } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import GeneralForm from './forms/general'
import ValuesForm from './forms/targetValues'
import AdditionalInfo from './forms/additionalInfo'
import DeadlineForm from './forms/deadlineInfo'

const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%"
    },
    button: {
      marginRight: theme.spacing(1)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }

  }));

function ModalStepper(props) {
    const activeStep = props.activeStep;
    const classes = useStyles()
    const [isMobile, setIsMobile] = useState(false)

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
    

    useEffect(()=>{
        window.addEventListener("resize", ()=>handleResize())
        
    })

    useEffect(()=>{
        handleResize()
    }, [])
    

    return (
        <React.Fragment>
            <Stepper activeStep={activeStep} style={{padding: 0, maxWidth: "100%"}}>
                <Step>
                    <StepLabel>{!isMobile ?  "General" : "" }</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{!isMobile ?  "Current and target values" : "" }</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{!isMobile ?  "Deadline" : "" }</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{!isMobile ?  "Additional Info" : "" }</StepLabel>
                </Step>

            </Stepper>
            {activeStep===0 ? <GeneralForm/> : null}
            {activeStep===1 ? <ValuesForm/> : null}
            {activeStep===2 ? <DeadlineForm/> : null}
            {activeStep===3 ? <AdditionalInfo/> : null}
        </React.Fragment>
    )
}

export default ModalStepper;