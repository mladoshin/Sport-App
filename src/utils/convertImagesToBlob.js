import Compress from "react-image-file-resizer";
export default function convertImagesToBlob(photos){
    var blobs = [];
    var promises = [];
        
        [...photos].forEach((photo, i) => {
            let p = new Promise((resolve, reject) => {
                Compress.imageFileResizer(
                    photo, // the file from input
                    1280, // width
                    720, // height
                    "JPEG", // compress format WEBP, JPEG, PNG
                    90, // quality
                    0, // rotation
                    (uri) => {
                      //console.log(uri);
                      // You upload logic goes here
                      resolve(uri)
                    },
                    "blob" // blob or base64 default base64
                  );
            })
            promises.push(p)
            
        })
        
        return Promise.all(promises).then((res) => {
            return res
        })
    
}