const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.database()
var fireDB = admin.firestore()

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.sayHello = functions.https.onCall((data, context) => {
    return data.name
})

exports.addUserRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            role: data.role
        });
    }).then(() => {
        return {
            role: data.role,
            message: data.email + " is now " + data.role
        }
    }).catch(err => {
        return err;
    });
})

exports.getUserIP = functions.https.onCall((data, context) => {

    return admin.auth().getUserByEmail(data.email).then(user => {
        return user.uid + "/user-info/geolocation"
    }).then(ref => {
        return admin
            .database()
            .ref(ref)
            .once("value")
            .then(snapshot => {
                return snapshot.val()
            })

    }).then(geo => {
        return {
            ip: geo.ip,
            city: geo.city,
            status: 200
        }
    }).catch(err => {
        functions.logger.info(err, { structuredData: true });
        return {
            status: 500
        }
    })
})

// user delete trigger
exports.userDeleted = functions.auth.user().onDelete(user => {
    console.log("Email: " + user.email);
    return fireDB.collection("users").doc(user.uid).delete().catch(err => functions.logger.info(err, { structuredData: true }))
})

// user create tigger
exports.userCreated = functions.auth.user().onCreate(user => {
    console.log("Email: " + user.email);

})

exports.getUserGeolocation = functions.https.onCall((data, context) => {
    return admin.database().ref(data.uid + "/user-info/geolocation").once("value", snapshot => {
        return snapshot.val()
    })
})

function getUsersDataByIds(userIds) {
    let promises = []
    userIds.forEach(id => {
        const promise = new Promise((resolve, reject) => {
            admin.firestore().collection("users").doc(id).get().then(snapshot => {
                const data = snapshot.data()
                data.uid = snapshot.id
                resolve(data)
            }).catch(err => reject(err))
        })
        promises.push(promise)
    })

    return Promise.all(promises)
}

function prepareMembersData(data, ownerId, groupId) {
    data.forEach(member => {
        let role = "member"
        if (member.uid === ownerId) {
            role = "owner"
        }

        const memberData = {
            name: member.name,
            surname: member.surname,
            photoURL: member.photoURL,
            role: role
        }

        //add the member to the subcollection
        admin.firestore().collection("training-groups").doc(groupId).collection("members").doc(member.uid).set(memberData)
    })
}

exports.createTrainingGroup = functions.https.onCall((data, context) => {
    const ownerId = context.auth.uid
    const memberIds = data.memberIds

    functions.logger.log(memberIds)

    const groupData = {
        name: data.groupName,
        owner: ownerId,
        isPrivate: data.isPrivate,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        members: [...memberIds, ownerId]
    }

    admin.firestore().collection("training-groups").add(groupData).then(ref => {
        const groupId = ref.id
        getUsersDataByIds([...memberIds, ownerId]).then(res => {
            prepareMembersData(res, ownerId, groupId)
        })
    })
})

exports.addMembersToTrainingGroup = functions.https.onCall((data, context) => {
    const groupId = data.groupId
    const ownerId = context.auth.uid
    const memberIds = data.memberIds

    functions.logger.log(memberIds)

    memberIds.forEach(id => {
        admin.firestore().collection("training-groups").doc(groupId).update({
            members: admin.firestore.FieldValue.arrayUnion(id)
        })
    })


    getUsersDataByIds(memberIds).then(res => {
        prepareMembersData(res, ownerId, groupId)
    })
})

exports.removeMembersFromTrainingGroup = functions.https.onCall((data, context) => {
    const groupId = data.groupId
    const memberIds = data.memberIds

    memberIds.forEach(id => {
        admin.firestore().collection("training-groups").doc(groupId).update({
            members: admin.firestore.FieldValue.arrayRemove(id)
        })

        admin.firestore().collection("training-groups").doc(groupId).collection("members").doc(id).delete()
    })

})

function isAlreadySubscribed(groupId, uid) {
    return new Promise((resolve, reject) => {
        admin.firestore().collection("training-groups").doc(groupId).get().then(snap => {
            const members = snap.data().members
            const ownerId = snap.data().owner

            //reject if the user is group's Owner
            if (ownerId === uid) {
                reject("Error")
            }

            if (members.indexOf(uid) !== -1) {
                resolve(true)
            } else {
                resolve(false)
            }


        }).catch(err => reject(err))
    })
}

function isGroupOwner(groupId, uid) {
    return new Promise((resolve, reject) => {
        admin.firestore().collection("training-groups").doc(groupId).get().then(snap => {
            const ownerId = snap.data().owner

            if (uid === ownerId) {
                resolve(true)
            } else {
                resolve(false)
            }

        }).catch(err => reject(err))
    })
}

exports.subscribeToTrainingGroup = functions.https.onCall((data, context) => {
    const groupId = data.groupId
    const groupOwnerId = data.groupOwnerId
    const userId = context.auth.uid
    isAlreadySubscribed(groupId, userId).then(isSubscribed => {
        //if the user is not subscribed then subscribe him
        if (!isSubscribed) {
            admin.firestore().collection("training-groups").doc(groupId).update({
                members: admin.firestore.FieldValue.arrayUnion(userId)
            })

            getUsersDataByIds([userId]).then(res => {
                prepareMembersData(res, groupOwnerId, groupId)
            })
        }
    })


})

exports.unsubscribeFromTrainingGroup = functions.https.onCall((data, context) => {
    const groupId = data.groupId
    const userId = context.auth.uid
    isAlreadySubscribed(groupId, userId).then(isSubscribed => {
        if (isSubscribed) {
            admin.firestore().collection("training-groups").doc(groupId).update({
                members: admin.firestore.FieldValue.arrayRemove(userId)
            })

            admin.firestore().collection("training-groups").doc(groupId).collection("members").doc(userId).delete()
        }
    })
})

exports.applyToTrainingGroup = functions.https.onCall((data, context) => {
    const userId = context.auth.uid
    const groupId = data.groupId
    const applicationMessage = data.message

    getUsersDataByIds([userId]).then(res => {
        const user = res[0]
        if (!user) {
            return
        }

        let applicant = {
            name: user.name,
            surname: user.surname,
            photoURL: user.photoURL,
            applicationDate: admin.firestore.FieldValue.serverTimestamp(),
            message: applicationMessage
        }
        admin.firestore().collection("training-groups").doc(groupId).collection("applicants").doc(userId).set(applicant).catch(err => console.log(err))
    })
})

exports.removeApplicantFromTrainingGroup = functions.https.onCall((data, context) => {
    const userId = data.uid
    const groupId = data.groupId

    admin.firestore().collection("training-groups").doc(groupId).collection("applicants").doc(userId).delete().catch(err => console.log(err))
})

exports.updateTrainingGroupInfo = functions.https.onCall((data, context) => {
    const groupId = data.groupId
    const updates = data.updates
    const userId = context.auth.uid

    if (!groupId || !userId || !updates) {
        return
    }

    isGroupOwner(groupId, userId).then(isOwner => {
        if (isOwner && updates) {
            admin.firestore().collection("training-groups").doc(groupId).update(updates).catch(err => console.log(err))
        }
    })

})



exports.addNewPostToTrainingGroup = functions.https.onCall((data, context) => {
    const group = data.group
    const urls = data.urls
    const caption = data.caption
    const userId = context.auth.uid

    const post = {
        caption: caption,
        photos: urls,
        dateCreated: admin.firestore.FieldValue.serverTimestamp()
    }

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("posts").add(post)
        .catch(err => console.log(err))


})

exports.deleteWorkoutPlanFromTrainingGroup = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).delete().catch(err => functions.logger.log(err))
})

exports.createWorkoutPlan = functions.https.onCall((data, context) => {
    const group = data.group
    const workoutPlan = { ...data.workoutPlan, dateCreated: admin.firestore.FieldValue.serverTimestamp() }

    const doc = group.isPrivate ? "private" : "public"
    return admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").add(workoutPlan).catch(err => functions.logger.log(err))

})

exports.updateWorkoutPlan = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const updates = data.updates
    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update(updates).catch(err => functions.logger.log(err))
})

exports.addRecipientToTrainingPlan = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const recipientId = data.recipientId

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update({ recipients: admin.firestore.FieldValue.arrayUnion(recipientId) })
})

exports.deleteRecipientFromTrainingPlan = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const recipientId = data.recipientId

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).update({ recipients: admin.firestore.FieldValue.arrayRemove(recipientId) })
})

exports.createDayWorkout = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const workout = { ...data.workout, dateCreated: admin.firestore.FieldValue.serverTimestamp() }

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").add(workout)
        .then((docRef) => {
            let shortcut = {
                title: workout.title,
                dateStr: workout.dateStr
            }
            createDayWorkoutShortcut(group, planId, shortcut, docRef.id)
        })
        .catch(err => console.log(err))
})

function createDayWorkoutShortcut(group, planId, shortcut, workoutId) {
    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts").doc(workoutId).set(shortcut).catch(err => functions.logger(err))
}

exports.deleteDayWorkout = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const workoutId = data.workoutId
    const doc = group.isPrivate ? "private" : "public"

    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").doc(workoutId).delete()
        .then(() => {
            deleteDayWorkoutShortcut(group, planId, workoutId)
        })
})

function deleteDayWorkoutShortcut(group, planId, workoutId) {
    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts").doc(workoutId).delete()
}

exports.updateWorkoutContent = functions.https.onCall((data, context) => {
    const group = data.group
    const planId = data.planId
    const updates = data.updates
    const workoutId = data.workoutId

    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workouts").doc(workoutId).update(updates)
        .then(() => {

            let short_update = {}
            if (updates.title) {
                short_update.title = updates.title
            }
            if (short_update) {
                updateWorkoutShortcut(group, planId, workoutId, short_update)
            }


        }).catch(err => console.log(err))
})


function updateWorkoutShortcut(group, planId, workoutId, updates) {
    const doc = group.isPrivate ? "private" : "public"
    admin.firestore().collection("training-groups").doc(group.id).collection("content").doc(doc).collection("workout-plans").doc(planId).collection("workout-shortcuts").doc(workoutId).update(updates)
        .catch(err => console.log(err))
}

exports.getAllUsers = functions.https.onCall((data, context) => {
    return admin
        .database()
        .ref("/")
        .once("value")
        .then(snapshot => {
            let uids = []
            let obj = snapshot.val()
            //let vals = Object.values(obj)
            //functions.logger.info(vals, { structuredData: true });
            functions.logger.info(obj, { structuredData: true });
            let ids = Object.keys(obj)
            var userList = Object.keys(obj).map(key => { return { name: obj[key]["user-info"].name, surname: obj[key]["user-info"].surname, uid: key, city: obj[key]["user-info"]["geolocation"].city, email: obj[key]["user-info"].email } })
            userList.forEach(user => {
                uids.push(user)
            });
            functions.logger.info(uids, { structuredData: true });

            return uids
        })
})

function getGroupMembers(groupId) {
    return fireDB.collection("tarining-groups").doc(groupId).get().then(res => { return res.get("members") })
}

exports.addPersonalChat = functions.https.onCall((data, context) => {
    const recipientId = data.recipientId
    const userId = context.auth.uid

    const user = {
        name: context.auth.token.name,
        uid: userId,
        photoURL: context.auth.token.picture
    }

    functions.logger.log(user, { structuredData: true })

    getUsersDataByIds([recipientId]).then(res => {
        const recipient = res[0]

        if (recipient) {

            let chatData = {
                membersInfo: [recipient, user],
                memberIDs: [recipientId, userId],
                dateCreated: admin.firestore.FieldValue.serverTimestamp()
            }

            functions.logger.log(chatData, { structuredData: true })

            admin.firestore().collection("chat-groups").add(chatData)
                .then((docRef) => {
                    functions.logger.log("The chat group has been successfully added!")
                })
                .catch(err => console.log(err))

        }
    })
})

exports.addChatTrigger = functions.firestore
    .document('chat-groups/{chatId}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newChat = snap.data()
        const chatId = context.params.chatId
        functions.logger.info("New chat group has been created!");

        const memberIDs = snap.data().memberIDs

        getAllUsersByID(memberIDs).then(members => {
            admin.firestore().collection("chat-groups").doc(chatId).update({membersInfo: members})
        })
    });

function getAllUsersByID(IDs) {

    let p = new Promise((resolve, reject) => {
        admin.firestore().collection("users").where(admin.firestore.FieldPath.documentId(), "in", IDs).get().then(snap => {
            let users = []
            snap.forEach(doc => {
                users.push({ name: doc.get("name"), surname: doc.get("surname"), photoURL: doc.get("photoURL"), uid: doc.id })
            })
            console.log(users)
            resolve(users)
        }).catch(err => reject("Error" + err))
    })
    return p
}

exports.doesChatExist = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {

        admin.firestore().collection('chat-groups').where("memberIDs", "array-contains", context.auth.uid)
            .get()
            .then(snapshot => {
                let res = false
                snapshot.forEach(doc => {
                    const ids = doc.get("memberIDs")
                    if (ids[0] === data.memberId || ids[1] === data.memberId) {
                        res = true
                    }
                })
                resolve(res)

            })
            .catch(reason => {
                console.log('db.collection("users").get gets err, reason: ' + reason);
                reject(reason);
            });
    });
})

exports.getUserByEmail = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {
        var db = admin.firestore();
        db.collection('users').where("email", "==", data.email)
            .get()
            .then(snapshot => {
                let res = []
                snapshot.forEach((snap) => {
                    let user = { ...snap.data(), uid: snap.id }
                    functions.logger.info(user, { structuredData: true });
                    res.push(user)
                })
                resolve(res[0]);
            })
            .catch(reason => {
                console.log('db.collection("users").get gets err, reason: ' + reason);
                reject(reason);
            });
    });

});

// triggered when the user updayes his profile
exports.updateUserProfileTrigger = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        functions.logger.info("The user " + context.params.userId + " has updated his profile!");

        if (change.after.get("photoURL") !== change.before.get("photoURL")) {
            //the user has updated his profile photo
            functions.logger.info("The user " + context.params.userId + " has updated his profile avatar!");

            //change the profile photo in the db for chats
            admin.firestore().collection("chat-groups").where("memberIDs", "array-contains", context.params.userId).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let membersInfo = doc.data().membersInfo


                        membersInfo.forEach(info => {
                            if (info.uid === context.params.userId) {
                                info.photoURL = change.after.get("photoURL")
                            }
                        })

                        doc.ref.update({
                            membersInfo: membersInfo
                        })
                    })
                }).catch(err => functions.logger.error(err))

            // updating the training-groups records
            admin.firestore().collection("training-groups").where("members", "array-contains", context.params.userId).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.collection("members").doc(context.params.userId).update({ photoURL: change.after.get("photoURL") })
                    })
                }).catch(err => functions.logger.error(err))
        }
    });
