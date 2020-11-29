import React from "react"
import { Typography, Button, IconButton, Badge, Avatar, Grid, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles"
import firebase from "../../firebase/firebase"
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

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


function ProfileContent(props) {
    const classes = useStyles()
    const form = props.form

    console.log(form)

    const avatar = form.avatar
    const avatarSrc = form.avatarSrc
    const avatarAlt = form.avatarAlt
    const email = form.email
    const setAvatar = form.setAvatar
    const loadAvatar = form.loadAvatar
    const name = form.name
    const setName = form.setName
    const enableEdit = form.enableEdit
    const setEnableEdit = form.setEnableEdit

    function handleFileChange(file) {
        setAvatar(file)
        console.log(file)
      }
    
      function handleUpload(loadAvatar) {
        firebase.uploadAvatarToStorage(avatar, loadAvatar)
        firebase.updateUserProfile({photoUrl: avatar})
      }

    return (
        <div className={classes.container}>
            <Grid container direction="column" alignItems="stretch">
                <Grid item className={classes.AvatarContainer}>
                    <Badge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={<IconButton size="small" variant="contained"><CameraAltIcon /></IconButton>}
                    >
                        <Avatar className={classes.avatar} src={avatarSrc ? avatarSrc : null}>{avatarAlt}</Avatar>
                        <input type="file" name="avatarInput" className={classes.AvatarInput} onChange={(e) => handleFileChange(e.target.files[0])} />
                    </Badge>

                </Grid>

                {/*   Avatar Upload Button    */}
                <Grid item className={classes.UploadContainer}>
                    {avatar ? <Button onClick={() => handleUpload(loadAvatar)}>Upload</Button> : null}
                </Grid>

                {/*   User's Name (edittable) */}
                <Grid item >
                    <div className={classes.TextInputContainer}>
                        {enableEdit ? <TextField value={name} label="Name" variant="outlined" onChange={(e) => setName(e.target.value)} className={classes.NameInput} /> : <Typography variant="h4" style={{}} className={classes.NameTypography}>{name}</Typography>}
                        {!enableEdit ? <IconButton className={classes.EditBtn} onClick={() => setEnableEdit(!enableEdit)}><EditRoundedIcon /></IconButton> : null}
                    </div>
                </Grid>

                {/*   User's Email */}
                <Grid item>
                    <Typography variant="body1" className={classes.EmailTypography}>{email}</Typography>
                </Grid>

            </Grid>

        </div>
    )
}

export default ProfileContent