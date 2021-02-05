import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyAo_UVgQnHQ3bkaGO6O4y5ZaF5oOyb67h0",
  authDomain: "sport-app-16c82.firebaseapp.com",
  databaseURL: "https://sport-app-16c82.firebaseio.com",
  projectId: "sport-app-16c82",
  storageBucket: "sport-app-16c82.appspot.com",
  messagingSenderId: "814415843828",
  appId: "1:814415843828:web:008522ad1b0ffa4b25e9a1",
  measurementId: "G-953BWJQKWL"
};


class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth()
    this.storage = firebase.storage()
    this.db = firebase.database()
    this.functions = firebase.functions();

    //do not call this function
    let addUserRole = this.functions.httpsCallable("addUserRole")

    this.addCoachRole = (email) => addUserRole({email: email, role: "COACH"})
    this.addAdminRole = (email) => addUserRole({email: email, role: "ADMIN"})
    this.addSportsmanRole = (email) => addUserRole({email: email, role: "SPORTSMAN"})

    this.sayHello = this.functions.httpsCallable("sayHello")
    this.getUserIP = this.functions.httpsCallable("getUserIP")
    //firebaseall.analytics()
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }
  logout() {
    return this.auth.signOut()
  }

  async register(name, surname, email, password) {

    await this.auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification();
      })
    
    return this.auth.currentUser.updateProfile({
      displayName: name + " " + surname,
      userEmail: email
    })
  }

  updateUserProfileUrl(url) {
    return this.auth.currentUser.updateProfile({
      photoURL: url
    })
  }

  isCoach(id, setIsCoach){
    var starCountRef = this.db.ref(id+"/user-info/").orderByKey();
    starCountRef.on('value', function (snapshot) {
      console.log(snapshot.val())
      setIsCoach(snapshot.val().isCoach)
    })

  }

  updateUserProfile(props){
    this.db.ref(this.getCurrentUserId() + "/general").update({
      name: props.name ? props.name : null,
      photoUrl: props.photoUrl ? props.photoUrl : null
    })
  }

  getCurrentUserName() {
    return this.auth.currentUser && this.auth.currentUser.displayName
  }
  getCurrentUserId() {
    return this.auth.currentUser && this.auth.currentUser.uid
  }
  isInit() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve)
    })
  }
  resetUserPassword(e, email) {
    e.preventDefault();
    this.auth.sendPasswordResetEmail(email).then(() => this.redirect(email)).catch(function (error) {
      alert(error.message)
      // An error happened.
    });
  }

  redirect(email) {
    this.logout()
    sessionStorage.setItem("Auth", false)
    window.location.reload()
    if (email.indexOf("@mail.ru") + 1) {
      window.open("https://e.mail.ru/inbox")
    } else if (email.indexOf("@gmail.com") + 1) {
      window.open("https://mail.google.com/mail")
    } else if (email.indexOf("@yandex.ru") + 1) {
      window.open("https://mail.yandex.ru/")
    }
    console.log("email sent")
  }

  loadUserGoals(loadGoalItems, loadCategories) {
    var starCountRef = this.db.ref(this.getCurrentUserId() + "/goals/").orderByKey();
    starCountRef.on('value', function (snapshot) {
      var goalItems = [] //local temp variable
      var goalCategories = {}
      var identificators = snapshot.val() ? Object.keys(snapshot.val()) : null
      var i = 0

      snapshot.forEach(function (snapItem) {
        const item = snapItem.val();
        item.id = identificators[i]
        goalItems.push(item)

        if (goalCategories[item.category] === undefined) {
          goalCategories[item.category] = { count: 0, completedCount: 0 }
        }
        if (item.isCompleted) {
          goalCategories[item.category].completedCount++
        }
        goalCategories[item.category].count++

        i++
      });

      //goalCategories = Array.from(new Set(goalCategories))
      //load json of all photos from database into redux state
      loadGoalItems(goalItems)
      loadCategories(goalCategories)
    });
  }

  addNewGoal(props) {
    //console.log(props)
    try {
      const id = this.db.ref(this.getCurrentUserId() + "/goals").push({
        name: props.name,
        category: props.category,
        type: props.type,
        units: props.units,
        targetValue: props.targetValue,
        startValue: props.startValue,
        currentValue: props.startValue,
        deadline: props.deadline,
        description: props.description,
        dateCreated: Date.now(),
        isCompleted: false,
        isArchieved: false,
        startRepsValue: props.startRepsValue,
        targetRepsValue: props.targetRepsValue,
        currentRepsValue: props.startRepsValue
      });

      //this.quickResultUpdate(props.startValue, id.key)
    } catch (err) {
      alert(err.message)
    }

  }

  completeGoal(id) {
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + id).update({
        isCompleted: true
      });
    } catch (err) {
      alert(err.message)
    }
  }

  uncompleteGoal(id) {
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + id).update({
        isCompleted: false
      });
    } catch (err) {
      alert(err.message)
    }
  }

  quickResultUpdate(result, currentRepsValue, id) {
    console.log("Updating the goal through the quick update modal")
    console.log(result, currentRepsValue, id)
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + id).update({
        currentValue: result,
        currentRepsValue: currentRepsValue ? currentRepsValue : null
      });
      
    } catch (err) {
      alert(err.message)
    }
  }

  updateGoal(goal) {
    console.log(goal)
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + goal.id).update({
        name: goal.name,
        category: goal.category,
        type: goal.type,
        units: goal.units,
        targetValue: goal.targetValue,
        currentValue: goal.startValue,
        deadline: goal.deadline,
        description: goal.description,
        targetRepsValue: goal.targetRepsValue ? goal.targetRepsValue : null,
        currentRepsValue: goal.startRepsValue ? goal.startRepsValue : null
      });
      //this.quickResultUpdate(goal.startValue, goal.currentRepsValue, goal.id) //push currentValue to goal stats
    } catch (err) {
      alert(err.message)
    }
  }

  checkUser(id, type){
    if (this.auth.currentUser.emailVerified && type=="VERIFICATION"){
      this.removeNotification(id, "VERIFIED")
    }
  }

  loadNotifications(loadNotificationsToRedux) {
    console.log("Running firebase.loadNotifications!")
    console.log(this.getCurrentUserId())
    var starCountRef = this.db.ref("/"+this.getCurrentUserId() + "/notifications/").orderByKey().limitToLast(100);

    starCountRef.on('value', function (snapshot) {
      var notificationItems = [] //local temp variable
      var identificators = snapshot.val() ? Object.keys(snapshot.val()) : null

      var i = 0;

      snapshot.forEach(function (snapItem) {
        var item = snapItem.val()
        item.id = identificators[i]
        
        notificationItems.push(item)
        i++
      });
      
      console.log(notificationItems)
      
      

      //goalCategories = Array.from(new Set(goalCategories))
      //load json of all photos from database into redux state
      loadNotificationsToRedux(notificationItems)
    });
  }

  deleteGoal(goalId) {
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + goalId).remove()
    } catch (err) {
      alert(err.message)
    }
  }

  removeNotification(notificationId, type)
  {
    if (type !== "VERIFICATION")
    {
      try {
        this.db.ref(this.getCurrentUserId() + "/notifications/" + notificationId).remove()
      } catch (err) {
        alert(err.message)
      }
    }
  }

  uploadAvatarToStorage(avatar, loadAvatar) {
    const uploadTask = this.storage.ref(this.getCurrentUserId() + "/avatar/avatar.jpg").put(avatar)
    uploadTask.on("state_changed",
      snapshot => {

      },
      error => {
        //errror function
        console.log(error.message)
      },
      () => {
        this.storage
          .ref(this.getCurrentUserId() + "/avatar/")
          .child("avatar.jpg")
          .getDownloadURL()
          .then(avatarUrl => {
            this.auth.currentUser.updateProfile({
              photoURL: avatarUrl
            })
            this.updateUserProfile({photoUrl: avatarUrl})
            loadAvatar(avatarUrl)
          })
      }
    )
  }


}

export default new Firebase()