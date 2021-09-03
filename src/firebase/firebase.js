import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import "firebase/functions"
require("firebase/firestore");


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
    !firebase.apps.length && firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth()
    this.storage = firebase.storage()
    this.db = firebase.database()
    this.fireDB = firebase.firestore()
    this.functions = firebase.functions();

    //do NOT call this function from outside Firebase class
    let addUserRole = this.functions.httpsCallable("addUserRole")

    //function to add user a COACH role
    this.addCoachRole = (email) => addUserRole({ email: email, role: "COACH" })

    //function to add user a ADMIN role
    this.addAdminRole = (email) => addUserRole({ email: email, role: "ADMIN" })

    //function to add user a SPORTSMAN role
    this.addSportsmanRole = (email) => addUserRole({ email: email, role: "SPORTSMAN" })

    //this.sayHello = this.functions.httpsCallable("sayHello")
    this.getUserIP = this.functions.httpsCallable("getUserIP")


    // <---------------callable functions for training groups------------------------>

    let createTrainingGroup = this.functions.httpsCallable("createTrainingGroup")
    this.createNewTrainingGroup = (memberIds, groupName, isPrivate) => createTrainingGroup({memberIds: memberIds, groupName: groupName, isPrivate: isPrivate})

    let addMembers = this.functions.httpsCallable("addMembersToTrainingGroup")
    this.addMembersToTrainingGroup = (memberIds, groupId) => addMembers({memberIds, groupId})

    let removeMembers = this.functions.httpsCallable("removeMembersFromTrainingGroup")
    this.removeMembersFromTrainingGroup = (memberIds, groupId) => removeMembers({memberIds, groupId})
    // <---------------callable functions for training groups------------------------>


    let getUserByEmail = this.functions.httpsCallable("getUserByEmail")
    this.getUserByEmail = (email) => getUserByEmail({ email })

    let doesChatExist = this.functions.httpsCallable("doesChatExist")
    this.doesChatExist = (memberId) => doesChatExist({ memberId })
  }

  //function for logging the user in
  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  //function to log the user out
  logout() {
    return this.auth.signOut()
  }


  //function for getting all existing users with options(user's role)
  getAllUsers(options, setUsers) {
    if (options.role !== "ALL") {
      this.fireDB.collection("users").where("role", "==", options.role).get()
        .then((snapshot) => {

          let userList = []
          snapshot.forEach(snap => {
            let user = snap.data()
            user.id = snap.id
            userList.push(user)
          })
          setUsers(userList)
        });
    } else {
      this.fireDB.collection("users").get()
        .then((snapshot) => {

          let userList = []
          snapshot.forEach(snap => {
            let user = snap.data()
            user.id = snap.id
            userList.push(user)
          })
          setUsers(userList)
        });
    }

  }

  //function for updating user's preferences in firebase firestore
  updateUserPreferences(updates) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("private").doc("preferences").update(updates)
      .then(() => console.log("User's preferences have successfully updated!"))
      .catch(err => console.log(err))
  }


  //<-----------------------FUNCTIONS FOR NOTES PAGE (START)----------------------->//

  //function for adding new note to firebase firestore
  addNote(note) {
    console.log("adding note...")
    console.log(note)
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("notes").add(note)
      .then((docRef) => {
        console.log("New note with id " + docRef.id + " has been added!")
        this.addNoteThumb(note, docRef.id)
      })
      .catch(err => console.log(err))
  }

  //function for deleting the user's note with particular noteIf from firebase firestore
  deleteNote(noteId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("notes").doc(noteId).delete()
      .then(() => {
        console.log("New note with id " + noteId + " has been deleted!")
        this.deleteNoteThumb(noteId)
      })
      .catch(err => console.log(err))
  }

  //function for deleting the note-thumbnail with particular noteId from firebase firestore    P.S -> could be done with firebase functions!
  deleteNoteThumb(noteId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("note-thumbs").doc(noteId).delete()
      .then(() => {
        console.log("note thumb with id " + noteId + " has been deleted!")
      })
      .catch(err => console.log(err))
  }

  //function for adding the note thumbnail (shortcut) to user's database (firebase firestore)    P.S -> could be done with firebase functions!
  addNoteThumb(note, noteId) {
    let noteThumb = {
      title: note.title,
      dateCreated: note.dateCreated
    }
    //console.log(noteThumb)
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("note-thumbs").doc(noteId).set(noteThumb)
      .catch(err => console.log(err))
  }


  //updating the note thumbnail (shortcut) with particular noteId in user's database (firebase firestore).   P.S -> could be done with firebase functions!
  updateNoteThumb(noteId, updates) {
    console.log("Updates in note-thumbs")
    console.log(updates)
    if (updates) {
      this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("note-thumbs").doc(noteId).update(updates)
        .catch(err => console.log(err))
    }

  }

  //function for updating the user's note in firebase-firestore
  updateNote(noteId, updates) {
    //console.log(noteId, updates)
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("notes").doc(noteId).update(updates)
      .catch(err => console.log(err))

    let thumbUpdates = updates.title ? { title: updates.title } : null
    this.updateNoteThumb(noteId, thumbUpdates)
  }

  //function for getting the user's single note data from firebase firestore
  getNote(uid, noteId, setNote) {
    //console.log(uid, noteId)
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("notes").doc(noteId)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          setNote(snapshot.data().data)
        }

      });
  }

  //function for getting all user's note thumbnails (shortcuts) from firebase firestore, this doesn't include the actual note data!
  getUserNoteThumbs(uid, setNotes) {
    return this.fireDB.collection("users").doc(uid).collection("note-thumbs")
      .onSnapshot((snapshot) => {
        let notesList = []
        snapshot.forEach((snap, index) => {
          let note = snap.data()
          note.id = snap.id
          notesList.push(note)
        })
        setNotes(notesList)

      });
  }

  //<-----------------------FUNCTIONS FOR NOTES PAGE (START)----------------------->//

  //function for getting user's preferences from firebase firestore
  getCurrentUserPreferences(setPreferences) {
    if (this.getCurrentUserId()) {
      return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("private").doc("preferences")
        .onSnapshot((snapshot) => {
          console.log(snapshot.empty)
          if (!snapshot.empty) {
            setPreferences(snapshot.data())
          }

        });
    }

  }

  //listener for auth state changes and sets the redux user state to current user (with custom claims)
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

  //function for registering a new user
  async register(name, surname, email, password) {

    await this.auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification();
      })

    //update user's auth profile
    return this.auth.currentUser.updateProfile({
      displayName: name + " " + surname,
      userEmail: email
    })
  }

  //function for updating the currrent user's profileURL (only in firebase auth state, NOT in database)
  updateUserProfileUrl(url) {
    return this.auth.currentUser.updateProfile({
      photoURL: url
    })
  }

  //function for getting current user's displayName (from firebase auth state)
  getCurrentUserName() {
    return this.auth.currentUser && this.auth.currentUser.displayName
  }

  //function for getting current user's id (from firebase auth state)
  getCurrentUserId() {
    return this.auth.currentUser && this.auth.currentUser.uid
  }

  //function-listener that listens for firebase service to initialise 
  isInit() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve)
    })
  }

  //function for resetting user's password (send an reset email)
  resetUserPassword(e, email) {
    e.preventDefault();
    this.auth.sendPasswordResetEmail(email).then(() => this.redirect(email)).catch(function (error) {
      alert(error.message)
      // An error happened.
    });
  }

  //function for redirecting the user to mailbox 
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

  //<-----------------------FUNCTIONS FOR GOAL TRACKER (START)----------------------->//
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

  deleteGoal(goalId) {
    try {
      this.db.ref(this.getCurrentUserId() + "/goals/" + goalId).remove()
    } catch (err) {
      alert(err.message)
    }
  }

  //<-----------------------FUNCTIONS FOR GOAL TRACKER (END)----------------------->// P.S. -> NOT WORKING YET!

  //function for checking if the user has verified his email
  checkUser(id, type) {
    if (this.auth.currentUser.emailVerified && type == "VERIFICATION") {
      this.removeNotification(id, "VERIFIED")
    }
  }

  //<-----------------------FUNCTIONS FOR NOTIFICATIONS (START)----------------------->//  P.S. -> NOT WORKING YET!
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

  removeNotification(notificationId, type) {
    if (type !== "VERIFICATION") {
      try {
        this.db.ref(this.getCurrentUserId() + "/notifications/" + notificationId).remove()
      } catch (err) {
        alert(err.message)
      }
    }
  }

  //<-----------------------FUNCTIONS FOR NOTIFICATIONS (END)----------------------->//


  //function for uploading user's avatar to firebase storage
  uploadAvatarToStorage(avatar, updateAvatarState) {
    const uploadTask = this.storage.ref("/users/"+this.getCurrentUserId() + "/avatar/avatar.jpg").put(avatar)
    return uploadTask.on("state_changed",
      snapshot => {

      },
      error => {
        //errror function
        console.log(error.message)
      },
      () => {
        return uploadTask.snapshot.ref.getDownloadURL()
          .then(avatarUrl => {
            this.auth.currentUser.updateProfile({
              photoURL: avatarUrl
            })
            this.updateUserProfile(avatarUrl)
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

  updateUserProfile(avatarUrl) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).update({ photoURL: avatarUrl }).catch(err => console.log(err))
  }


  //<-----------------------FUNCTIONS FOR WORKOUT BUILDER (START)----------------------->//

  addWorkout(userId, date, name) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("workouts").add({
      name: name,
      date: date,
      timestamp: Date.now()
    })
  }

  //addCircuitToWorkout(userId, workoutId, circuitId, circuits){
  //    this.fireDB.collection("users").doc(userId).collection("workouts").doc(workoutId).update({
  //       circuits: [...circuits, circuitId]
  //    })
  //}

  addCircuit(userId, circuit, workoutId) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").add({
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
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").where("circuitId", "==", circuitId)
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
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").doc(circuitId).update({
      exercises: [...exercises, exercise]
    })
  }

  addExercise(userId, exercise, circuitId) {
    console.log("Adding ne exercise to curcuit with Id:" + circuitId)
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").add({
      name: exercise.name,
      circuitId: circuitId,
      repsNumber: exercise.repsNumber
    }).then(docRef => {
      return docRef.id
    })
  }

  getWorkouts(userId, date, setWorkouts) {
    this.fireDB.collection("users").doc(userId).collection("workouts").orderBy("timestamp", "asc")
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
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("workouts").doc(workoutId).delete()
  }

  deleteExercise(userId, exerciseId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("exercises").doc(exerciseId).delete()
  }

  deleteCircuit(userId, exercises, circuitId) {
    console.log(exercises)
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").doc(circuitId).delete().then(() => {
      exercises.forEach((exercise, index) => this.deleteExercise(userId, exercise.id))
    })
  }

  getCircuits(userId, workoutId, setCircuits) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("circuits").where("workoutId", "==", workoutId).orderBy("timestamp", "asc")
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

  //<-----------------------FUNCTIONS FOR WORKOUT BUILDER (END)----------------------->//



  //<------------------------------------FUNCTIONS FOR TODOS-CALENDAR (START)------------------------------------------>

  //function for getting single day content form firebase firestore
  getDayContent(userId, dayId, date, setDayContent) {
    return this.fireDB.collection("users").doc(userId).collection("daily-todos")
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

  //function for deleting single day content form firebase firestore, and deleting all Todos for this day as well
  deleteDay(userId, date, dateId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").doc(dateId)
      .delete()
      .then(() => console.log("Day Event was successfully deleted!"))
      .then(() => {
        //delete all todos for this day
        this.getTodosForDeletion(userId, date).then(res => this.deleteTodos(userId, res))
      })
      .catch(err => console.log(err))
  }
  //function for completing the todo with unique todoId
  completeTodo(userId, todoId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(todoId).update({
      completed: true
    })
      .then(() => console.log("Todo " + todoId + " has been completed!"))
      .catch(err => console.log(err))
  }

  //function for uncompleting the todo with unique todoId
  uncompleteTodo(userId, todoId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(todoId).update({
      completed: false
    })
      .then(() => console.log("Todo " + todoId + " has been completed!"))
      .catch(err => console.log(err))
  }

  //function for deleting the list of todos, each with unique todoId
  deleteTodos(userId, array) {
    array.forEach((id, index) => {
      this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").doc(id).delete()
        .then(() => console.log("ToDo " + id + " has been deleted!"))
        .catch(err => console.log(err))
    })
  }

  //function for getting all the todos for particular day, which is being deleted
  getTodosForDeletion(userId, date) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").where("date", "==", date)
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

  //function for updating Day name in firebase firestore
  updateDayContentName(userId, dateId, newName) {
    console.log(dateId)
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").doc(dateId).update({
      name: newName
    })
      .then(() => console.log("Your day name was successfully updated!"))
      .catch(err => console.log(err))
  }

  //function which checks if the DAY is EMPTY from any content and returneither true or false
  isDayContentEmpty(userId, dayId, date) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").where("date", "==", date)
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

  //function for fetching all the todos for particular date from firebase firestore
  getTodos(userId, date, setToDos) {
    return this.fireDB.collection("users").doc(userId).collection("todos-content").where("date", "==", date).orderBy("timestamp", "asc")
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

  //function which adds new todo to firebase firestore
  addTodo(userId, payload) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("todos-content").add(payload)
      .then((docRef) => {
        return docRef.id
      })
  }

  //function which adds new habit to firebase firestore
  addHabit(payload) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("habits").add(payload)
      .then((docRef) => {
        return docRef.id
      })
  }

  //function for fetching all the user's habits
  getHabits(userId, setHabits) {
    return this.fireDB.collection("users").doc(userId).collection("habits")
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

  //function for changing the number of completed habits in a day
  changeCompletedHabits(userId, dateId, oldQuantity, val) {
    let newQuantity = oldQuantity + val
    this.fireDB.collection("users").doc(userId).collection("daily-todos").doc(dateId).update({
      completedHabits: newQuantity
    })
      .then(() => console.log("Your day name was successfully updated!"))
      .catch(err => console.log(err))
  }

  //function for completing the habit with unique habitId for particular date
  completeHabit(userId, date, habitId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").add({
      date: date
    })
      .then(() => console.log("Habit " + habitId + " has been completed!"))
      .catch(err => console.log(err))
  }

  //function for uncompleting the habit with unique habitId for particular date
  uncompleteHabit(userId, date, habitId) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").where("date", "==", date).get()
      .then(snapshot => {
        console.log(snapshot.docs[0].id)
        this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").doc(snapshot.docs[0].id).delete().catch(err => console.log(err))
      })
      .then(() => console.log("Habit " + habitId + " has been uncompleted!"))
      .catch(err => console.log(err))
  }

  //function for fetching the single habit completed status (if it is completed or not on particular date)
  getHabitStatusForDate(userId, habitId, date, setChecked) {
    return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("habits").doc(habitId).collection("progress").where("date", "==", date)
      .onSnapshot((snapshot) => {
        setChecked(!snapshot.empty)
      })
  }

  //function for adding day content on given date
  addDayContent(userId, dayId, payload) {

    this.isDayContentEmpty(userId, dayId, payload.date)
      .then(res => {
        if (res) {

          return this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("daily-todos").add(payload)
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

  //<-----------------------FUNCTIONS FOR TODOS-CALENDAR (END)----------------------->//


  //<-----------------------FUNCTIONS FOR TRAINING GROUPS (START)----------------------->//

  // addTrainingGroup(payload, coachId, membersId, members) {

  //   this.fireDB.collection("training-groups").add(payload)
  //     .then((docRef) => {
  //       //adding new group shortcut to coach (can be done using firebase functions)
  //       this.addTrainingGroupToCoach({ name: payload.name, dateCreated: payload.dateCreated, isPrivate: payload.isPrivate, members: membersId }, coachId, docRef.id)
  //       this.addMembersToTrainingGroup(docRef.id, members)
  //     })
  // }

  //only for owners
  updateTrainingGroupInfo(updates, groupId) {
    this.fireDB.collection("training-groups").doc(groupId).update(updates).catch(err => console.log(err))
  }

  getUserProfilePhotoURL(members, setMemberPhotoURLS) {
    let memberIds = members.map(member => { return member.uid })
    console.log("memberIds")
    console.log(members)
    this.fireDB.collection("users").where(firebase.firestore.FieldPath.documentId(), "in", memberIds).get().then(snapshot => {
      let members = []
      snapshot.forEach((member) => {
        members.push(member.get("photoURL"))
      })
      setMemberPhotoURLS(members)
    })
  }

  getAllMembersInTrainingGroup(groupId, setMembers, setOwners) {
    this.fireDB.collection("training-groups").doc(groupId).collection("members")
      .onSnapshot((snapshot) => {
        let members = []
        let owners = []
        snapshot.forEach((member, index) => {
          let memberItem = member.data()
          memberItem.uid = member.id
          
          if(memberItem.role==="owner"){
            owners.push(memberItem)
          }else{
            members.push(memberItem)
          }
          
        })
        setMembers(members)
        setOwners(owners)
      });
  }

  getUserTrainingGroups(uid, setGroups) {
    this.fireDB.collection("training-groups").where("members", "array-contains", uid)
      .onSnapshot((snapshot) => {
        let groups = []
        snapshot.forEach((group, index) => {
          let groupItem = group.data()
          groupItem.groupId = group.id
          groups.push(groupItem)
        })
        setGroups(groups)
      });
  }

  //function for applying to private training groups
  applyToTrainingGroup(groupId, userId, user) {
    this.fireDB.collection("training-groups").doc(groupId).collection("applicants").doc(userId).set(user).catch(err => console.log(err))
  }


  getAllApplicantsFromTrainingGroup(groupId, setRequests) {
    return this.fireDB.collection("training-groups").doc(groupId).collection("applicants").orderBy("applicationDate", "desc")
      .onSnapshot(snapshot => {
        let res = []
        snapshot.forEach((snap, index) => {
          res.push({ ...snap.data(), uid: snap.id })
        })
        setRequests(res)
      })
  }

  removeApplicantFromTrainingGroup(groupId, userId) {
    this.fireDB.collection("training-groups").doc(groupId).collection("applicants").doc(userId).delete().catch(err => console.log(err))
  }

  getOwnerTrainingGroups(coachId, setGroups) {
    return this.fireDB.collection("training-groups").where("owner", "==", coachId)
      .onSnapshot((snapshot) => {
        let groups = []
        snapshot.forEach((group, index) => {
          let groupItem = group.data()
          groupItem.groupId = group.id
          groups.push(groupItem)
        })
        setGroups(groups)
      });
  }

  getAllPublicTrainingGroups(setPublicGroups) {
    return this.fireDB.collection("training-groups").onSnapshot(snapshot => {
      let groups = []
      snapshot.forEach((group, index) => {
        let groupItem = group.data()
        groupItem.groupId = group.id
        groups.push(groupItem)
      })
      setPublicGroups(groups)
    })
  }

  getTrainingGroupContent(groupId, setGroupContent) {
    return this.fireDB.collection("training-groups").doc(groupId)
      .onSnapshot((snapshot) => {
        let group = { ...snapshot.data(), id: snapshot.id }
        setGroupContent(group)
      })
  }

  getPostsFromTrainingGroup(group, setPosts) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("posts").orderBy("dateCreated", "desc")
      .onSnapshot(snapshot => {
        let posts = []
        snapshot.forEach((snap, index) => {
          posts.push({ ...snap.data(), postId: snap.id })
        })
        setPosts(posts)
      })
  }

  deleteTrainingGroup(groupId) {
    this.fireDB.collection("training-groups").doc(groupId).delete().catch(err => console.log(err))
  }

  //function for fetching (listener) the workout plans from the training group (for owners only!)
  getWorkoutPlansInTrainingGroup(group, setWorkoutPlans) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans")
      .onSnapshot(snapshot => {
        let plans = []
        snapshot.forEach((plan, index) => {
          plans.push({ ...plan.data(), planId: plan.id })
        })
        setWorkoutPlans(plans)
      })
  }

  getMemberWorkoutPlansFromTrainingGroup(group, setMemberPlans) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").where("recipients", "array-contains", this.getCurrentUserId())
      .onSnapshot(snapshot => {
        let member_plans = []
        snapshot.forEach((member_plan, index) => {
          member_plans.push({ ...member_plan.data(), planId: member_plan.id })
        })
        setMemberPlans(member_plans)
      })
  }

  getWorkoutPlanById(group, planId, setPlanInfo) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId)
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          return
        }
        setPlanInfo(snapshot.data())
      })
  }

  //function for creating the workout plan in the training group
  createWorkoutPlan(group, workoutPlan) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").add(workoutPlan).then(docRef => {
      return docRef.id
    })
  }

  deleteRecipientFromTrainingPlan(group, planId, recipientId) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update({ recipients: firebase.firestore.FieldValue.arrayRemove(recipientId) })
  }

  addRecipientFromTrainingPlan(group, planId, recipientId) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update({ recipients: firebase.firestore.FieldValue.arrayUnion(recipientId) })
  }

  updateWorkoutPlan(group, planId, updates) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update(updates).catch(err => console.log(err))
  }

  createDayWorkout(group, planId, workout) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").add(workout)
      .then((docRef) => {
        console.log("The workout has been successfuly added!")
        let shortcut = {
          title: workout.title,
          dateStr: workout.dateStr
        }
        this.createDayWorkoutShortcut(group, planId, shortcut, docRef.id)
      })
      .catch(err => console.log(err))
  }

  createDayWorkoutShortcut(group, planId, shortcut, workoutId) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts").doc(workoutId).set(shortcut).then(() => console.log("The workout shortcut has been successfuly added!")).catch(err => console.log(err))
  }

  //function for deleting the workout plan from the training group
  deleteWorkoutPlanFromTrainingGroup(group, planId) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).delete().then(() => console.log("The workout plan has been successfuly deleted!")).catch(err => console.log(err))
  }

  getDayWorkoutShortcutsFromPlan(group, planId, setDayWorkoutShortcuts) {
    const doc = group.isPrivate ? "private" : "public"
    return this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts")
      .onSnapshot(snapshot => {
        let workouts_short = []
        snapshot.forEach((snap, index) => {
          let shortcut = {
            title: snap.get("title"),
            start: snap.get("dateStr"),
            allDay: true,
            workoutId: snap.id
          }
          workouts_short.push(shortcut)
        })
        setDayWorkoutShortcuts(workouts_short)
      })
  }

  getWorkoutContent(group, planId, dateStr, setWorkoutContent) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").where("dateStr", "==", dateStr)
      .get()
      .then(snapshot => {
        let workout_content = []
        snapshot.forEach((snap, index) => {
          workout_content.push({ ...snap.data(), workoutId: snap.id })
        })
        setWorkoutContent(workout_content)
      })
  }

  updateWorkoutContent(group, planId, workoutId, updates) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").doc(workoutId).update(updates)
      .then(() => {

        let short_update = {}
        if (updates.title) {
          short_update.title = updates.title
        }
        this.updateWorkoutShortcut(group, planId, workoutId, short_update)

      }).catch(err => console.log(err))
  }

  updateWorkoutShortcut(group, planId, workoutId, updates) {
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts").doc(workoutId).update(updates)
      .catch(err => console.log(err))
  }

  //<-----------------------FUNCTIONS FOR TRAINING GROUPS (END)----------------------->//

  //<-----------------------FUNCTIONS FOR CHAT (START)----------------------->//

  addNewChat(members) {
    let chatData = {
      membersInfo: members,
      memberIDs: members.map(member => member.uid),
      dateCreated: firebase.firestore.FieldValue.serverTimestamp()
    }

    console.log("Chat data: ")
    console.log(chatData)

    this.fireDB.collection("chat-groups").add(chatData)
      .then((docRef) => {
        console.log("The chat group has been successfully added!")
      })
      .catch(err => console.log(err))
  }

  getChatData(chatId, setChatData, setChatMessages) {
    this.fireDB.collection("users").doc(this.getCurrentUserId()).collection("chats").doc(chatId)
      .onSnapshot((snapshot) => {
        setChatData(snapshot.data())
      })

    this.fireDB.collection("chat-groups").doc(chatId).collection("messages").orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        let messageList = []
        snapshot.forEach((snap, index) => {
          let message = { ...snap.data(), id: snap.id }
          messageList.push(message)
        })
        setChatMessages(messageList)
      })
  }

  getAllUserChats(userId, setChatGroups) {
    return this.fireDB.collection("users").doc(userId).collection("chats")
      .onSnapshot((snapshot) => {
        let chatList = []
        snapshot.forEach((snap, index) => {
          let chat = snap.data()
          chat.chatId = snap.id
          chatList.push(chat)
        })
        setChatGroups(chatList)
      })
  }


  addMessageToChat(sender, text, chatId) {
    
    this.fireDB.collection("chat-groups").doc(chatId).collection("messages").add({
      senderId: sender.uid,
      senderName: sender.name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  getGroupChatsForTrainingGroup(groupId, setChats) {
    this.fireDB.collection("chat-groups").where("groupId", "==", groupId)
      .onSnapshot((snapshot) => {
        let chats = []
        snapshot.forEach((snap, index) => {
          let chat = { ...snap.data(), chatId: snap.id }
          chats.push(chat)
        })
        setChats(chats)
      })
  }


  addNewGroupChat(groupId, members, title) {
    let chatData = {
      memberIDs: members,
      groupId: groupId,
      title: title,
      dateCreated: Date.now()
    }

    console.log("Chat data: ")
    console.log(chatData)
    this.fireDB.collection("chat-groups").add(chatData)
      .then((docRef) => {
        console.log("The chat group has been successfully added!")
      })
      .catch(err => console.log(err))
  }

  getUserInfoById(userId) {
    return this.fireDB.collection("users").doc(userId).get()
      .then((snapshot) => {
        let user = {
          name: snapshot.data().name,
          surname: snapshot.data().surname,
          uid: snapshot.id,
          photoURL: snapshot.data().photoURL,
          role: snapshot.data().role
        }
        return user
      }).then(user => {
        return user
      }).catch(err => console.log(err))
  }
  //<-----------------------FUNCTIONS FOR CHAT (END)----------------------->//

  generateSalt(length){
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const salt = []
    for(let i=0; i < length; i++){
      console.log()
      let index = Math.floor(Math.random()*(alphabet.length-1))
      const char = alphabet[index]
      salt.push(char)
    }

    return salt.join("")

  }

  async uploadPostImagesToGroup(group, files, caption) {
    let url_list = []
    const promises = [];

    Array.from(files).forEach((file, index) => {
      const NewUploadPromise = new Promise((resolve, reject) => {

        const fileName = this.generateSalt(4)+Date.now()+".jpg"
        console.log(file)
        const uploadTask = this.storage.ref("/training-group-posts/"+group.id + `/${fileName}`).put(file)
        return uploadTask.on("state_changed",
          snapshot => {
  
          },
          error => {
            //errror function
            console.log(error.message)
            reject()
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              console.log(url)
              //url_list.push(url)
              resolve(url)
            })
            
          }
        )

      })
      promises.push(NewUploadPromise)

      


    })

    
    //add posts to firebase firestore
    

    Promise.all(promises)
       .then(async () => {
          let urls = []
          console.log(promises)
          promises.forEach(async (promise) => {
            urls.push(await promise)
          })
         

         return await urls
       }).then(urls => {
          const newPost = {
            caption: caption,
            photos: urls,
            dateCreated: Date.now()
          }
          console.log(newPost)
          this.addNewPostToTrainingGroup(group, newPost)
       })
       .catch(err => console.log(err.code));
    //console.log(newPost)
    //await 


  }

  addNewPostToTrainingGroup(group, post){
    const doc = group.isPrivate ? "private" : "public"
    this.fireDB.collection("training-groups").doc(group.id).collection("content").doc(doc).collection("posts").add(post)
    .catch(err => console.log(err))
  }




}



export default new Firebase()