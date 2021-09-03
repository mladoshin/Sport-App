import {Paper} from "@material-ui/core"
import React, { useState, useEffect } from "react"
import firebase from "../../../firebase/firebase"
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Compress from "react-image-file-resizer";
import TextMobileStepper from "../imageCarousel"
import NewsPublishComponent from "../newsPublishComponent"


function NewsTab(props) {
    const [posts, setPosts] = useState([])
    const [uploadOpen, setUploadOpen] = useState(false)
    const [photos, setPhotos] = useState([])
    const [photosBLOB, setPhotosBLOB] = useState([])

    const [commited, setCommited] = useState(false)

    useEffect(()=>{
        //fetch all the posts in the training group
        return firebase.getPostsFromTrainingGroup(props.group, setPosts)
    }, [])

    function handleConvertImagesToBlob(){
        var blobs = [];
        [...photos].forEach((photo, i) => {
            
            Compress.imageFileResizer(
                photo, // the file from input
                1280, // width
                720, // height
                "JPEG", // compress format WEBP, JPEG, PNG
                70, // quality
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


    function handlePublishPost(caption){
        //1) upload the images and get the links into an array
        firebase.uploadPostImagesToGroup(props.group, photosBLOB, caption)
        //2) upload the images url array and caption to the firestore
        
    }

    const posts_list = (
        <div style={{display: "flex", flexDirection: "column"}}>
            {posts.map((post, index) => {
                return(
                    <center><TextMobileStepper photos={post.photos.reverse()} caption={post.caption}/></center>
                )
                
            })}
        </div>
    )

    return (
        <div>
            <NewsPublishComponent publish={handlePublishPost} photosBLOB={photosBLOB} setPhotosBLOB={setPhotosBLOB}/>

            <Paper style={{padding: 15}}>
                <h1>Posts Page...</h1>
                {posts_list}
            </Paper>
            
            
        </div>
    )
}

export default NewsTab;