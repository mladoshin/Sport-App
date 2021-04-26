import 'firebase/storage'
import firebase from 'firebase'


//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAo_UVgQnHQ3bkaGO6O4y5ZaF5oOyb67h0",
    authDomain: "sport-app-16c82.firebaseapp.com",
    databaseURL: "https://sport-app-16c82.firebaseio.com",
    projectId: "sport-app-16c82",
    storageBucket: "training-groups-post-images.appspot.com",
    messagingSenderId: "814415843828",
    appId: "1:814415843828:web:008522ad1b0ffa4b25e9a1",
    measurementId: "G-953BWJQKWL"
  };


class FirebaseGroup {
    constructor(){
        firebase.initializeApp(firebaseConfig);
        this.storage = firebase.storage()
    }

    uploadPostImagesToGroup(groupId, files, caption) {

        Array.from(files).forEach((file, index) => {
          const uploadTask = this.storage.ref(groupId + `/${file.name}`).put(file)
          return uploadTask.on("state_changed",
            snapshot => {
    
            },
            error => {
              //errror function
              console.log(error.message)
            },
            async () => {
              const postImageURL = await uploadTask.snapshot.ref.getDownloadURL()
              console.log(postImageURL)
            }
          )
        })
    
      }

}

export default new FirebaseGroup()