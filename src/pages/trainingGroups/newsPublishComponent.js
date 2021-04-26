import { TextField, Button, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, Input, DialogActions, Paper } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import firebase from "../../firebase/firebase"
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Compress from "react-image-file-resizer";
import TextMobileStepper from "./imageCarousel"

function NewsPublishComponent(props) {
    const [caption, setCaption] = useState("")
    const [uploadOpen, setUploadOpen] = useState(false)
    const [photos, setPhotos] = useState([])
    //const [photosBLOB, setPhotosBLOB] = useState([])
    const {photosBLOB, setPhotosBLOB} = props

    const [commited, setCommited] = useState(false)


    useEffect(()=>{
        console.log(photosBLOB)
    }, [photosBLOB])

    function handleConvertImagesToBlob(){
        var blobs = [];
        [...photos].forEach((photo, i) => {
            
            Compress.imageFileResizer(
                photo, // the file from input
                1280, // width
                720, // height
                "JPEG", // compress format WEBP, JPEG, PNG
                90, // quality
                0, // rotation
                (uri) => {
                  console.log(uri);
                  // You upload logic goes here
                  blobs.push(uri)
                },
                "blob" // blob or base64 default base64
              );
              setPhotosBLOB(blobs)
        })
        
    }

    function handleCancel(all){
        setUploadOpen(false)
        setPhotos([])
        setPhotosBLOB([])
        if (all){
            setCaption("")
        }
        setCommited(false)

    }

    function handleNext(){
        if(Array.from(photos).length){
            handleConvertImagesToBlob()
            setUploadOpen(false)
            setCommited(true)
        }     
    }

    function handlePublishPost(){
        props.publish(caption)
        handleCancel()
    }

    return (
        <Paper style={{backgroundColor: "#ccc", border: "1px solid black", padding: 15}}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><IconButton onClick={()=>setUploadOpen(true)}><AttachFileIcon/></IconButton></InputAdornment>,
                }}
                style={{flex: 1}}
                placeholder="Post's text"
                value={caption}
                onChange={(e)=>setCaption(e.target.value)}
                />
                <Button variant="outlined" color="primary" style={{marginLeft: 15}} onClick={handlePublishPost}>Publish</Button>
                {commited && Array.from(photos).length && <Button variant="outlined" color="secondary" onClick={()=>handleCancel(true)}>Cancel</Button> }
            </div>

            <center>
                {commited ? <TextMobileStepper photos={photos} caption={caption} type="preview"/> : null}
            </center>

            <Dialog open={uploadOpen} onClose={()=>setUploadOpen(false)}>
                <DialogTitle>Upload images</DialogTitle>
                <DialogContent>
                    <Input type="file" onChange={(e)=>setPhotos(e.target.files)} inputProps={{multiple: true}}/>
                    
                    {photos.length ? <TextMobileStepper photos={photos} caption={caption} type="preview"/> : null}
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="outlined" onClick={handleCancel}>Cancel</Button>
                    <Button color="primary" variant="outlined" onClick={handleNext}>Next</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default NewsPublishComponent;