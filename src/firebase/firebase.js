import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import "firebase/functions"
require("firebase/firestore");

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
    this.firedDB = firebase.firestore()
    this.functions = firebase.functions();

    //do not call this function
    let addUserRole = this.functions.httpsCallable("addUserRole")

    this.addCoachRole = (email) => addUserRole({ email: email, role: "COACH" })
    this.addAdminRole = (email) => addUserRole({ email: email, role: "ADMIN" })
    this.addSportsmanRole = (email) => addUserRole({ email: email, role: "SPORTSMAN" })

    this.sayHello = this.functions.httpsCallable("sayHello")
    this.getUserIP = this.functions.httpsCallable("getUserIP")
    this.getAllUsers = this.functions.httpsCallable("getAllUsers")
    //firebaseall.analytics()
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }
  logout() {
    return this.auth.signOut()
  }

  getCurrentUser(setUser) {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log("User is signed in")
        //console.log(user)

        user.getIdTokenResult()
          .then((idTokenResult) => {
            return idTokenResult.claims
          }).then((claims) => {
            let userInfo = {
              displayName: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              uid: user.uid,
              claims: claims
            }
            //console.log(userInfo)

            return userInfo
          }).then(userInfo => {
            setUser(userInfo)

          })
          .catch((error) => {
            console.log(error);
            //props.history.replace("/404")
          });


      } else {
        // No user is signed in.
        console.log("User is NOT signed in!")
        setUser({ id: null, auth: false })
      }
    });
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

  isCoach(id, setIsCoach) {
    var starCountRef = this.db.ref(id + "/user-info/").orderByKey();
    starCountRef.on('value', function (snapshot) {
      console.log(snapshot.val())
      setIsCoach(snapshot.val().isCoach)
    })

  }

  updateUserProfile(props) {
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

  checkUser(id, type) {
    if (this.auth.currentUser.emailVerified && type == "VERIFICATION") {
      this.removeNotification(id, "VERIFIED")
    }
  }

  loadNotifications(loadNotificationsToRedux) {
    console.log("Running firebase.loadNotifications!")
    console.log(this.getCurrentUserId())
    var starCountRef = this.db.ref("/" + this.getCurrentUserId() + "/notifications/").orderByKey().limitToLast(100);

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

  removeNotification(notificationId, type) {
    if (type !== "VERIFICATION") {
      try {
        this.db.ref(this.getCurrentUserId() + "/notifications/" + notificationId).remove()
      } catch (err) {
        alert(err.message)
      }
    }
  }



  uploadAvatarToStorage(avatar, updateAvatarState) {
    const uploadTask = this.storage.ref(this.getCurrentUserId() + "/avatar/avatar.jpg").put(avatar)
    return uploadTask.on("state_changed",
      snapshot => {

      },
      error => {
        //errror function
        console.log(error.message)
      },
      () => {
        return this.storage
          .ref(this.getCurrentUserId() + "/avatar/")
          .child("avatar.jpg")
          .getDownloadURL()
          .then(avatarUrl => {
            this.auth.currentUser.updateProfile({
              photoURL: avatarUrl
            })
            //this.updateUserProfile({photoUrl: avatarUrl})
            //loadAvatar(avatarUrl)
            return avatarUrl
          }).then(url => {
            updateAvatarState(url)
            console.log("The avatar has been uploaded!")
            return url
          })
      }
    )
  }


  //FUNCTIONS FOR WORKOUT BUILDER (START)
  addWorkout(userId, date, name) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("workouts").add({
      name: name,
      date: date,
      timestamp: Date.now()
    })
  }

  //addCircuitToWorkout(userId, workoutId, circuitId, circuits){
  //    this.firedDB.collection("users").doc(userId).collection("workouts").doc(workoutId).update({
  //       circuits: [...circuits, circuitId]
  //    })
  //}

  addCircuit(userId, circuit, workoutId) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").add({
      name: circuit.name,
      iterNum: circuit.iterNum,
      exercises: [],
      workoutId: workoutId,
      timestamp: Date.now()
    }).then(docRef => {
      return docRef.id
    })
  }

  getExercises(userId, circuitId, setExercises) {
    console.log("circuitId = " + circuitId)
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").where("circuitId", "==", circuitId)
      .onSnapshot((snapshot) => {

        let list = []
        snapshot.forEach(snap => {
          let exercise = snap.data()
          exercise.id = snap.id
          list.push(exercise)
        })
        setExercises(list)
      });
  }

  addExerciseToCircuit(userId, circuitId, exercise, exercises) {
    console.log(exercises)
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").doc(circuitId).update({
      exercises: [...exercises, exercise]
    })
  }

  addExercise(userId, exercise, circuitId) {
    console.log("Adding ne exercise to curcuit with Id:" + circuitId)
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").add({
      name: exercise.name,
      circuitId: circuitId,
      repsNumber: exercise.repsNumber
    }).then(docRef => {
      return docRef.id
    })
  }

  getWorkouts(userId, date, setWorkouts) {
    this.firedDB.collection("users").doc(userId).collection("workouts").orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {

        let list = []
        snapshot.forEach(snap => {
          let workout = snap.data()
          workout.id = snap.id
          list.push(workout)
        })
        setWorkouts(list)
      });
  }

  deleteWorkout(userId, workoutId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("workouts").doc(workoutId).delete()
  }

  deleteExercise(userId, exerciseId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").doc(exerciseId).delete()
  }

  deleteCircuit(userId, exercises, circuitId) {
    console.log(exercises)
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").doc(circuitId).delete().then(() => {
      exercises.forEach((exercise, index) => this.deleteExercise(userId, exercise.id))
    })
  }



  getCircuits(userId, workoutId, setCircuits) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").where("workoutId", "==", workoutId).orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {

        let list = []
        snapshot.forEach(snap => {
          let circuit = snap.data()
          circuit.id = snap.id
          list.push(circuit)
        })
        setCircuits(list)
        console.log("List of circuits for workout" + workoutId)
        console.log(list)
      });
  }
  //FUNCTIONS FOR WORKOUT BUILDER (END)


  
  //<------------------------------------FUNCTIONS FOR TODOS-CALENDAR (START)------------------------------------------>

  getDayContent(userId, dayId, date, setDayContent) {
    return this.firedDB.collection("users").doc(userId).collection("daily-todos")
      .onSnapshot((snapshot) => {
        let daysList = []
        snapshot.forEach((doc, index) => {
          let day = {
            title: doc.data().name,
            start: doc.data().date,
            allDay: true,
            id: doc.id,
            completedHabits: doc.data().completedHabits
          }
          daysList.push(day)
        })
        setDayContent(daysList)
      });
  }

  deleteDay(userId, date, dateId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").doc(dateId)
      .delete()
      .then(() => console.log("Day Event was successfully deleted!"))
      .then(() => {
        this.getTodosForDeletion(userId, date).then(res => this.deleteTodos(userId, res))
      })
      .catch(err => console.log(err))
  }

  completeTodo(userId, todoId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(todoId).update({
      completed: true
    })
      .then(() => console.log("Todo " + todoId + " has been completed!"))
      .catch(err => console.log(err))
  }

  uncompleteTodo(userId, todoId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(todoId).update({
      completed: false
    })
      .then(() => console.log("Todo " + todoId + " has been completed!"))
      .catch(err => console.log(err))
  }

  deleteTodos(userId, array) {
    array.forEach((id, index) => {
      this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(id).delete()
        .then(() => console.log("ToDo " + id + " has been deleted!"))
        .catch(err => console.log(err))
    })
  }

  getTodosForDeletion(userId, date) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").where("date", "==", date)
      .get()
      .then((snapshot) => {
        let idList = []
        snapshot.forEach((doc, index) => {
          idList.push(doc.id)
        })
        return idList
      })
      .then(res => { return res })
  }
  updateDayContentName(userId, dateId, newName) {
    console.log(dateId)
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").doc(dateId).update({
      name: newName
    })
      .then(() => console.log("Your day name was successfully updated!"))
      .catch(err => console.log(err))
  }

  isDayContentEmpty(userId, dayId, date) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").where("date", "==", date)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("The day is empty!")
          return true
        } else {
          console.log("The day is NOT empty!")
          return false
        }
      }).then(res => { return res })
  }

  getTodos(userId, date, setToDos) {
    return this.firedDB.collection("users").doc(userId).collection("todos-content").where("date", "==", date).orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        let todos = []
        snapshot.forEach((todo, index) => {
          let todoItem = {
            name: todo.data().name,
            date: todo.data().date,
            completed: todo.data().completed,
            id: todo.id
          }
          todos.push(todoItem)
        })
        setToDos(todos)
      });
  }

  addTodo(userId, payload) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").add(payload)
      .then((docRef) => {
        return docRef.id
      })
  }

  addHabit(userId, payload) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("habits").add(payload)
      .then((docRef) => {
        return docRef.id
      })
  }

  getHabits(userId, setHabits) {
    return this.firedDB.collection("users").doc(userId).collection("habits")
      .onSnapshot((snapshot) => {
        let habits = []
        snapshot.forEach((habit, index) => {
          let habitItem = {
            name: habit.data().name,
            startDate: habit.data().startDate,
            type: habit.data().type,
            id: habit.id,
            days: habit.data().days ? habit.data().days : null
          }
          console.log(habit)
          habits.push(habitItem)
        })
        setHabits(habits)
      });
  }

  changeCompletedHabits(userId, dateId, oldQuantity, val) {
    let newQuantity = oldQuantity + val
    this.firedDB.collection("users").doc(userId).collection("daily-todos").doc(dateId).update({
      completedHabits: newQuantity
    })
      .then(() => console.log("Your day name was successfully updated!"))
      .catch(err => console.log(err))
  }


  completeHabit(userId, date, habitId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").add({
      date: date
    })
      .then(() => console.log("Habit " + habitId + " has been completed!"))
      .catch(err => console.log(err))
  }

  uncompleteHabit(userId, date, habitId) {
    this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").where("date", "==", date).get()
      .then(snapshot => {
        console.log(snapshot.docs[0].id)
        this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").doc(snapshot.docs[0].id).delete().catch(err => console.log(err))
      })
      .then(() => console.log("Habit " + habitId + " has been uncompleted!"))
      .catch(err => console.log(err))
  }

  getHabitStatusForDate(userId, habitId, date, setChecked) {
    return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").where("date", "==", date)
      .onSnapshot((snapshot) => {
        setChecked(!snapshot.empty)
      })
  }

  addDayContent(userId, dayId, payload) {

    this.isDayContentEmpty(userId, dayId, payload.date)
      .then(res => {
        if (res) {

          return this.firedDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").add(payload)
            .then((docRef) => {
              return docRef.id
            })

        } else {
          alert("Data alredy exists!")
          return false
        }
      }).then(res => {
        return res
      })
  }

  //FUNCTIONS FOR TODOS-CALENDAR (END)

}

export default new Firebase()