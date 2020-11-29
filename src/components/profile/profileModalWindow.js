import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { connect } from "react-redux"
import { Typography, Button, IconButton, Badge, DialogActions, Avatar, Grid, TextField } from '@material-ui/core';
import firebase from '../../firebase/firebase'
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

import DialogComponent from "../DialogComponent/dialog";
import profileContent from "./profileContent"
import ProfileContent from "./profileContent";

const useStyles = makeStyles((theme) => ({
  DialogHeader: {
    display: "flex",
    flexDirection: "row",
    padding: "5px 10px 5px 20px",
    alignItems: "center"
  },
  DialogHeaderText: {
    flexGrow: 1,
    lineHeight: "48px"
  },
  container: {
    padding: 20
  },
  AvatarContainer: {
    textAlign: "center",
    paddingBottom: 20
  },
  avatar: {
    width: 100,
    height: 100,
    marginLeft: "auto",
    marginRight: "auto"
  },
  AvatarInput: {
    height: 100,
    width: 100,
    opacity: 0,
    position: "absolute",
    zIndex: 100
  },
  UploadContainer: {
    textAlign: "center"
  },
  TextInputContainer: {
    margin: "0px auto 0px auto",
    maxWidth: 350,
    display: "flex",
    position: "relative",
    alignItems: "center"
  },
  NameInput: {
    width: "100%"
  },
  NameTypography: {
    flexGrow: 1,
    textAlign: "center"
  },
  EditBtn: {
    position: "absolute",
    right: 0
  },
  EmailTypography: {
    textAlign: "center"
  }
}));



function ProfileModalWindow(props) {
  const openProfile = props.openProfile
  const setOpenProfile = props.setOpenProfile
  const [name, setName] = useState(props.user.name)
  const classes = useStyles()
  const avatarSrc = props.avatar

  //const name = firebase.auth.currentUser ? firebase.auth.currentUser.displayName : ""
  const email = props.user.email
  const avatarAlt = props.avatarAlt ? props.avatarAlt.toUpperCase() : ""
  const [avatar, setAvatar] = useState("")
  const [enableEdit, setEnableEdit] = useState(false)
  console.log(props)

  function handleClick(setUser) {
    if (name !== firebase.auth.currentUser.displayName) {
      firebase.auth.currentUser.updateProfile({
        displayName: name
      })
      firebase.updateUserProfile({name: name})
      setUser({ id: firebase.getCurrentUserId(), name: name, email: firebase.auth.currentUser.email, auth: true })
    }

    setOpenProfile(false)
  }

  return (
        <DialogComponent header="Profile" setOpenAddModal={setOpenProfile} openAddModal={openProfile ? true : false} maxWidth="md">
          
          <ProfileContent form={{name, setName, email, avatar, setAvatar, enableEdit, setEnableEdit, avatarAlt, loadAvatar: props.loadAvatar, avatarSrc}}/>

          <DialogActions>
            <Button onClick={()=>handleClick(props.setUser)}>Save Changes</Button>
          </DialogActions>
        </DialogComponent>
  )
}

const mapStateToProps = (state) => {
  return {
    avatar: state.userAvatar
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
    setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileModalWindow);