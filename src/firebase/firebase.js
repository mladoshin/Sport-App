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
    this.createNewTrainingGroup = (memberIds, groupName, isPrivate) => createTrainingGroup({ memberIds: memberIds, groupName: groupName, isPrivate: isPrivate })

    let addMembers = this.functions.httpsCallable("addMembersToTrainingGroup")
    this.addMembersToTrainingGroup = (memberIds, groupId) => addMembers({ memberIds, groupId })

    let removeMembers = this.functions.httpsCallable("removeMembersFromTrainingGroup")
    this.removeMembersFromTrainingGroup = (memberIds, groupId) => removeMembers({ memberIds, groupId })

    let subscribe = this.functions.httpsCallable("subscribeToTrainingGroup")
    this.subscribeToTrainingGroup = (groupId, groupOwnerId) => subscribe({ groupId, groupOwnerId })

    let unsubscribe = this.functions.httpsCallable("unsubscribeFromTrainingGroup")
    this.unsubscribeFromTrainingGroup = (groupId) => unsubscribe({ groupId })

    let apply = this.functions.httpsCallable("applyToTrainingGroup")
    this.applyToTrainingGroup = (groupId, message) => apply({ groupId, message })

    let removeApplicant = this.functions.httpsCallable("removeApplicantFromTrainingGroup")
    this.removeApplicantFromTrainingGroup = (uid, groupId) => removeApplicant({ uid, groupId })

    let updateGroup = this.functions.httpsCallable("updateTrainingGroupInfo")
    this.updateTrainingGroupInfo = (groupId, updates) => updateGroup({ groupId, updates })

    let addNewPost = this.functions.httpsCallable("addNewPostToTrainingGroup")
    this.addNewPostToTrainingGroup = (group, urls, caption) => addNewPost({ group, urls, caption })

    let createWorkoutPlan_l = this.functions.httpsCallable("createWorkoutPlan")
    this.createWorkoutPlan = (group, workoutPlan) => createWorkoutPlan_l({ group, workoutPlan })

    let deleteWorkoutPlan = this.functions.httpsCallable("deleteWorkoutPlanFromTrainingGroup")
    this.deleteWorkoutPlanFromTrainingGroup = (group, planId) => deleteWorkoutPlan({ group, planId })

    let updateWorkoutPlan_l = this.functions.httpsCallable("updateWorkoutPlan")
    this.updateWorkoutPlan = (group, planId, updates) => updateWorkoutPlan_l({ group, planId, updates })

    let addRecipientToTrainingPlan_l = this.functions.httpsCallable("addRecipientToTrainingPlan")
    this.addRecipientToTrainingPlan = (group, planId, recipientId) => addRecipientToTrainingPlan_l({ group, planId, recipientId })

    let deleteRecipientFromTrainingPlan_l = this.functions.httpsCallable("deleteRecipientFromTrainingPlan")
    this.deleteRecipientFromTrainingPlan = (group, planId, recipientId) => deleteRecipientFromTrainingPlan_l({ group, planId, recipientId })

    let createDayWorkout_l = this.functions.httpsCallable("createDayWorkout")
    this.createDayWorkout = (group, planId, workout) => createDayWorkout_l({ group, planId, workout })

    let deleteDayWorkout_l = this.functions.httpsCallable("deleteDayWorkout")
    this.deleteDayWorkout = (group, planId, workoutId) => deleteDayWorkout_l({ group, planId, workoutId })

    let updateWorkoutContent_l = this.functions.httpsCallable("updateWorkoutContent")
    this.updateWorkoutContent = (group, planId, workoutId, updates) => updateWorkoutContent_l({ group, planId, workoutId, updates })

    let addPersonalChat_l = this.functions.httpsCallable("addPersonalChat")
    this.addPersonalChat = (recipientId) => addPersonalChat_l({ recipientId })
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

  //function for uploading user's avatar to firebase storage
  uploadAvatarToStorage(avatar, updateAvatarState) {
    const uploadTask = this.storage.ref("/users/" + this.getCurrentUserId() + "/avatar/avatar.jpg").put(avatar)
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


  //method for fetching members and owners of a training group
  getAllMembersInTrainingGroup(groupId, setMembers, setOwners) {
    this.fireDB.collection("training-groups").doc(groupId).collection("members")
      .onSnapshot((snapshot) => {
        let members = []
        let owners = []
        snapshot.forEach((member, index) => {
          let memberItem = member.data()
          memberItem.uid = member.id

          if (memberItem.role === "owner") {
            owners.push(memberItem)
          } else {
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

  getAllTrainingGroups(setPublicGroups) {
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

  getAllUserGroups(setUserGroups, setOwnerGroups) {
    return this.fireDB.collection("training-groups").where("members", "array-contains", this.getCurrentUserId()).onSnapshot(snapshot => {
      let groups = []
      let ownerGroups = []
      snapshot.forEach((group, i) => {
        let groupItem = group.data()
        groupItem.groupId = group.id

        if (groupItem.owner == this.getCurrentUserId()) {
          ownerGroups.push(groupItem)
        } else {
          groups.push(groupItem)
        }

      })

      let userGroups = {
        asMember: groups,
        asOwner: ownerGroups
      }

      setUserGroups(userGroups)
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

  getAllUserChats(setUserGroupChats, setChatGroups) {
    console.log("Fetching group chats")
    return this.fireDB.collection("chat-groups").where("memberIDs", "array-contains", this.getCurrentUserId())
      .onSnapshot(snap => {
        let groupChats = []
        let personalChats = []
        snap.forEach(doc => {
          let chat = doc.data()
          chat.chatId = doc.id
          if (chat.groupId) {
            groupChats.push(chat)
          } else {
            personalChats.push(chat)
          }

        })

        setUserGroupChats(groupChats)
        setChatGroups(personalChats)
      })
  }

  addMessageToChat(sender, text, chatId, fileURLs) {
    let message = {
      senderId: sender.uid,
      senderName: sender.name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }

    if (fileURLs?.length) {
      message.fileURLs = fileURLs
    }

    this.fireDB.collection("chat-groups").doc(chatId).collection("messages").add(message)
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


  addNewGroupChat(groupId, members, title, groupName) {

    this.getAllUsersByID(members).then(users => {
      let chatData = {
        memberIDs: members,
        groupId: groupId,
        groupName: groupName,
        title: title,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp()
      }

      console.log("Chat data: ")
      console.log(chatData)
      this.fireDB.collection("chat-groups").add(chatData)
        .then((docRef) => {
          console.log("The chat group has been successfully added!")
        })
        .catch(err => console.log(err))

    })
  }

  deleteChat(chatId) {
    this.fireDB.collection("chat-groups").doc(chatId)
      .delete()
      .catch(err => console.log(err))


  }

  getAllUsersByID(IDs) {
    console.log(firebase.firestore.FieldPath.documentId())
    let p = new Promise((resolve, reject) => {
      this.fireDB.collection("users").where(firebase.firestore.FieldPath.documentId(), "in", IDs).get().then(snap => {
        let users = []
        snap.forEach(doc => {
          users.push({ ...doc.data(), uid: doc.id })
        })
        console.log(users)
        resolve(users)
      }).catch(err => reject("Error" + err))
    })
    return p
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

  uploadFilesToChat(files, chatId) {

    let url_list = []
    const promises = [];

    Array.from(files).forEach((file, index) => {
      const NewUploadPromise = new Promise((resolve, reject) => {

        const fileName = this.generateSalt(4) + Date.now() + ".jpg"
        console.log(file)
        const uploadTask = this.storage.ref("/chat-attachments/" + chatId + `/${fileName}`).put(file)
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
    return Promise.all(promises)
      .then(res => {
        return res
      })
  }
  //<-----------------------FUNCTIONS FOR CHAT (END)----------------------->//

  generateSalt(length) {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const salt = []
    for (let i = 0; i < length; i++) {
      console.log()
      let index = Math.floor(Math.random() * (alphabet.length - 1))
      const char = alphabet[index]
      salt.push(char)
    }

    return salt.join("")

  }

  //function for uploading posts photos to the storage
  async uploadPostImagesToGroup(group, files, caption) {
    let url_list = []
    const promises = [];

    Array.from(files).forEach((file, index) => {
      const NewUploadPromise = new Promise((resolve, reject) => {

        const fileName = this.generateSalt(4) + Date.now() + ".jpg"
        console.log(file)
        const uploadTask = this.storage.ref("/training-group-posts/" + group.id + `/${fileName}`).put(file)
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
        this.addNewPostToTrainingGroup(group, urls, caption)
      })
      .catch(err => console.log(err.code));
  }


  getChat(chatId, setCurrentChat) {
    this.fireDB.collection("chat-groups").doc(chatId).get().then(snapshot => {
      if (!snapshot.exists) return
      const chat = { ...snapshot.data(), chatId: snapshot.id }
      setCurrentChat(chat)
    })
  }

  //get all messages in chat with chatId 
  getChatMessages(chatId, setMessages, membersInfo) {
    //console.log(membersInfo)
    this.fireDB.collection("chat-groups")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(snapshot => {
        let messages = []
        snapshot.forEach(doc => {
          let senderId = doc.data().senderId
          let senderInfo = membersInfo ? membersInfo.filter(info => info.uid == senderId) : []
          let senderPhotoURL = senderInfo[0] ? senderInfo[0].photoURL : null
          let senderName = senderInfo[0] ? senderInfo[0].name : null

          messages.push({ ...doc.data(), messageId: doc.id, senderPhotoURL: senderPhotoURL })
        })
        setMessages(messages)
      })
  }



}



export default new Firebase()