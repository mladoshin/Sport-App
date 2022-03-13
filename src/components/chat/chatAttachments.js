import { Grid } from "@material-ui/core"
import {useEffect, useState} from "react"
import firebase from "../../firebase/firebase"

function ChatAttachments({chatId, messages}) {
    const [allAttachments, setAllAtachments] = useState([])

    useEffect(()=>{
        
        chatId && firebase.fireDB.collection("chat-groups").doc(chatId).collection("messages").orderBy("fileURLs").get().then(snap => {
            let allAttachments = []
            snap.forEach(doc => {
                let urls = doc.get("fileURLs")
                console.log(urls)
                urls.forEach(url => allAttachments.push(url))
            })
            setAllAtachments(allAttachments)
        })
        
    }, [chatId])

    return (
        <div>
            <Grid container>
                {allAttachments?.map((file, i) => {
                    return(
                        <Grid item style={{height: 200, width: 200}} xs={3} xl={2}>
                            <img src={file} style={{height: "100%", aspectRatio: "1/1", objectFit: "cover"}}/>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}

export default ChatAttachments
