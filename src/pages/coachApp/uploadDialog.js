//<-----------------------UPLOAD DIALOG COMPONENT----------------------->//
import React, { Suspense, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Container, Typography, CssBaseline, Tooltip, Fab, Dialog, DialogActions, IconButton, Divider, Button, Grid, Card, Avatar } from '@material-ui/core'
//import NavBar from "../../components/navigation/navbar"
import { withRouter, useParams } from "react-router-dom";
import firebase from '../../firebase/firebase';
//import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Compress from "react-image-file-resizer";

function UploadDialog(props) {
    //state for selected image
    const [avatarImg, setAvatarImg] = useState()
    console.log(avatarImg)
    
    //function for handling the avatar upload process
    function handleUpload(){
      console.log(firebase.getCurrentUserId())
      //call the async upload function 
      firebase.uploadAvatarToStorage(avatarImg, props.updateAvatar)
      //close the upload dialog
      props.handleClose()
    }

    //function for compressing the avatar image
    function handleCompressImage(){
        Compress.imageFileResizer(
            avatarImg, // the file from input
            480, // width
            480, // height
            "JPEG", // compress format WEBP, JPEG, PNG
            70, // quality
            0, // rotation
            (uri) => {
              console.log(uri);
              // You upload logic goes here
              setAvatarImg(uri)
            },
            "blob" // blob or base64 default base64
          );
    }
  
    return (
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Upload Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <input type="file" accept="image/*" onChange={(e)=>setAvatarImg(e.target.files[0])}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
            </Button>
          <Button onClick={()=>handleUpload()} color="primary">
            Upload
          </Button>
          <Button onClick={()=>handleCompressImage()} color="primary">
            Compress
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const mapStateToProps = state => {
    return {
      user: state.user
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      setUser: (obj) => dispatch({ type: "USER/LOADINFO", payload: obj }),
      updateAvatar: (url) => dispatch({ type: "USER/UPDATE-AVATAR", payload: url})
      //loadGoals: (arr) => dispatch({ type: "GOALS/LOAD", payload: arr }),
      //loadCategories: (arr) => dispatch({ type: "GOALS/CATEGORY/LOAD", payload: arr }),
      //loadAvatar: (url) => dispatch({ type: "AVATAR/LOAD", payload: url }),
      //loadNotifications: (arr)=>dispatch({type: "NOTIFICATION/LOAD", payload: arr})
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(UploadDialog)