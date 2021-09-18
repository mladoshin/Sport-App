//<-----------------------TRAINING GROUP PAGE (single)----------------------->//
import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Container, TextField, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import AddIcon from '@material-ui/icons/Add';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CustomAvatar from "../components/common/avatar"

import Paper from '@material-ui/core/Paper';
import GroupDialog from "../components/trainingGroups/trainingGroupDialog"
import NewsTab from "../components/trainingGroups/tabs/newsTab";
import WorkoutsTab from "../components/trainingGroups/tabs/workoutsTab";
import ChatTab from "../components/trainingGroups/tabs/chatTab";

//styles
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: "30px 0px 0px 0px"
    },
    gridItem: {
        padding: "1em"
    },
    upcomingDeadlinesCard: {
        height: 300,
        padding: 20
    },
    card: {
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    chartCard: {
        height: 400,
        padding: 20,
        [theme.breakpoints.up("md")]: {
            height: "40vh"
        }
    },
    card1: {
        minHeight: 300,
        [theme.breakpoints.up("md")]: {
            height: "30vh"
        },
        overflowY: "scroll"
    },
    searchBtn: {
        height: 45
    },
    searchInput: {
        height: "45px",
        boxSizing: "border-box"
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

}));

function TrainingGroupPage(props) {
    const classes = useStyles();
    const { groupId } = useParams()
    const [open, setOpen] = useState({ mode: null, payload: false })
    const [isViewable, setIsViewable] = useState(true)
    const [groupContent, setGroupContent] = useState({ name: "", owner: "", members: [] })
    const [groupMembers, setGroupMembers] = useState([])
    const [groupOwners, setGroupOwners] = useState([])
    const [loaded, setLoaded] = useState(false)

    const [currentPage, setCurrentPage] = useState(0)

    //fetch the training group general information
    useEffect(() => {
        return firebase.getTrainingGroupContent(groupId, setGroupContent)
    }, [])

    //fetch the training group members' list
    useEffect(() => {
        return firebase.getAllMembersInTrainingGroup(groupId, setGroupMembers, setGroupOwners)
    }, [])

    //useEffect to check if user can watch the group content
    useEffect(() => {
        let isInGroup = isUserInGroup(props.user.uid, groupContent.members)

        if (groupContent.isPrivate && !isInGroup && groupContent.owner !== props.user.uid) {
            //fetch the content for members
            console.log('%cThe user is NOT member in private group.', 'color: red; font-weight: 900; font-size: 20px')
            setIsViewable(false)
            setLoaded(true)
        } else if (isInGroup || groupContent.owner == props.user.uid) {
            console.log('%cThe user is a member in private group! ', 'color: red; font-weight: 900; font-size: 20px')
            setLoaded(true)
        }
    }, [groupContent])

    console.log(groupMembers)

    function isUserInGroup(uid, groupMembers) {
        let res = groupMembers.indexOf(uid)
        return res > -1 ? true : false
    }

    //function for owners only (editing and settings)
    function handleOpenDialog() {
        if (groupContent.owner === props.user.uid) {
            setOpen({ payload: groupContent, mode: "EDIT" })
        }
    }

    function handleUnsubscribe() {
        firebase.removeMemberFromTrainingGroup(groupContent.id, [props.user.uid])
    }

    function ActionButton() {
        const isInGroup = isUserInGroup(props.user.uid, groupContent.members)
        const isOwner = groupContent.owner === props.user.uid

        if (isOwner) {
            return (
                <Button size="small" color="secondary" onClick={handleOpenDialog}>Settings</Button>
            )
        } else {
            if (isInGroup) {
                //if the sportsman is in training group
                return (
                    <Button size="small" color="secondary" onClick={handleUnsubscribe}>Unsubscribe</Button>
                )

            } else if (!isInGroup && !groupContent.isPrivate) {
                //if the sportsman is NOT in training group
                return (
                    <Button size="small" color="secondary">Subscribe</Button>
                )
            } else {
                return (
                    <Button size="small" color="secondary">Apply</Button>
                )
            }
        }
    }

    //function for coaches to delete a training group
    function handleDeleteTainingGroup() {
        let consent = window.confirm("Are you sure? ")
        if (consent) {
            if (props.user.uid === groupContent.owner) {
                //delete the group
                console.log("Deleting group with id: " + groupId)

                if (props.user.claims.role == "COACH") {
                    console.log("redirect")
                    props.history.replace("/coachApp/coachId=" + props.user.uid + "/training-groups")
                } else if (props.user.claims.role == "COACH") {
                    props.history.replace("/sportsmanApp/userId=" + props.user.uid + "/training-groups")
                }

                firebase.deleteTrainingGroup(groupId)
            }
        }
    }

    function handleChangePage(event, newValue) {
        setCurrentPage(newValue)
    }

    //Tab panel component to render right content (for routing)
    const TabPanel = () => {
        if (currentPage === 0) {
            //show posts page
            return <NewsTab group={groupContent} />
        } else if (currentPage === 1) {
            //show workout page
            return <WorkoutsTab group={groupContent} />
        } else if (currentPage === 2) {
            //show chat
            return <ChatTab group={groupContent} />
        }
    }

    function OwnersGrid() {
        return (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{width: 100}}>
                    <h3>Owners:</h3>
                </div>
                
                <Grid container>
                    {
                        groupOwners.map(owner => {
                            return (
                                <Grid item lg={1}>
                                   <CustomAvatar user={owner} disableRipple={true} style={{border: "2px solid grey"}}/>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>

        )
    }

    return (
        <>
            <Container className={classes.mainContainer}>
                <h1>Training group Page with groupId: {groupId}</h1>
                <Paper style={{ padding: 15, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    <div style={{ flexGrow: 1 }}>
                        <h1>{groupContent.name}</h1>
                        
                        <OwnersGrid />
                        {props.user.claims && <ActionButton />}
                    </div>
                    <div style={{ textAlign: "center", padding: 10, width: "40%", borderLeft: "1px solid black" }}>
                        <h3>Members: {groupMembers?.length}</h3>
                        <Grid container>
                            {groupMembers.map((member, index) => {

                                return (
                                    <Grid item lg={1}>
                                        <CustomAvatar user={member} disableRipple={true} style={{border: "2px solid grey"}}/>
                            
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Button size="small" color="primary">Show all members</Button>
                    </div>
                    <div style={{ width: "100%", borderTop: "1px solid black", paddingTop: 15, display: isViewable && loaded ? "block" : "none" }} >
                        <Tabs
                            value={currentPage}
                            onChange={handleChangePage}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Posts" />
                            <Tab label="Workouts" />
                            <Tab label="Chat" />
                        </Tabs>
                    </div>

                </Paper>




                <Paper style={{ marginTop: 10, padding: 15, display: isViewable && loaded ? "block" : "none" }}>
                    <TabPanel currentPage={currentPage} />
                </Paper>

                {loaded && !isViewable ?
                    <Paper style={{ marginTop: 10, padding: 15 }}>
                        <div style={{ textAlign: "center" }}>
                            <h3>You can't see the content because the training group is private!</h3>
                        </div>
                    </Paper>
                    :
                    null
                }



                {open.payload ? <GroupDialog open={open} setOpen={setOpen} uid={props.user.uid} /> : null}

            </Container>
        </>

    )
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrainingGroupPage));