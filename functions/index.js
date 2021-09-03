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

function getUsersDataByIds(userIds){
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

function prepareMembersData(data, ownerId, groupId){
    data.forEach(member => {
        let role = "member"
        if(member.uid === ownerId){
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

//trigger for updated training groups
// exports.updateTrainingGroupTrigger = functions.firestore
//     .document('training-groups/{groupId}')
//     .onUpdate((change, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         const newValue = change.after.data()
//         const oldValue = change.before.data()
//         const owner = newValue.owner
//         const membersAfter = newValue.members
//         const membersBefore = oldValue.members
//         const groupId = context.params.groupId

//         const groupShortcut = {
//             name: newValue.name,
//             isPrivate: newValue.isPrivate,
//             dateCreated: newValue.dateCreated,
//             members: membersAfter,
//             owner: owner
//         }

//         functions.logger.info(groupId, { structuredData: true });
//         functions.logger.info(owner, { structuredData: true });

//         fireDB.collection("users").doc(owner).collection("training-groups").doc(groupId).update(groupShortcut)

//         membersAfter.forEach((memberId) => {
//             fireDB.collection("users").doc(memberId).collection("training-groups").doc(groupId).update(groupShortcut)
//         })


//         functions.logger.info("Training group has been updated!");
//         functions.logger.info(newValue, { structuredData: true });
//         functions.logger.info(oldValue, { structuredData: true });

//         // perform desired operations ...
//     });

function getGroupMembers(groupId) {
    return fireDB.collection("tarining-groups").doc(groupId).get().then(res => { return res.get("members") })
}

// exports.addNewMemberToTrainingGroup = functions.firestore
//     .document('training-groups/{groupId}/members/{memberId}')
//     .onCreate((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         const memberId = context.params.memberId
//         const groupId = context.params.groupId
//         functions.logger.info("New member has been added to training group!");

//         fireDB.collection("training-groups").doc(groupId).update({ members: admin.firestore.FieldValue.arrayUnion(memberId) })

//     });

// exports.removeMemberFromTrainingGroup = functions.firestore
//     .document('training-groups/{groupId}/members/{memberId}')
//     .onDelete((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         const memberId = context.params.memberId
//         const groupId = context.params.groupId
//         functions.logger.info("New member has been added to training group!");

//         fireDB.collection("training-groups").doc(groupId).update({ members: admin.firestore.FieldValue.arrayRemove(memberId) })

//     });

exports.addChatTrigger = functions.firestore
    .document('chat-groups/{chatId}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newChat = snap.data()
        functions.logger.info("New chat group has been created!");

        const members = snap.get("members")
        functions.logger.info(members, { structuredData: true });

        let chatShortcut = {
            dateCreated: snap.get("dateCreated"),
            members: members
        }
        functions.logger.info(chatShortcut, { structuredData: true });


        //fireDB.collection("users").doc(owner).collection("training-groups").doc(snap.id)
        //    .set(groupShortcut)
        //    .catch(err => functions.logger.info(err, { structuredData: true }))

        members.forEach((member, index) => {
            var addedMembers = members.filter(function (x) { return x !== member; });

            functions.logger.info("addedMembers");
            functions.logger.info(addedMembers, { structuredData: true });

            let chatShortcut = {
                dateCreated: snap.get("dateCreated"),
                members: addedMembers
            }

            functions.logger.info("chatShortcut");
            functions.logger.info(chatShortcut, { structuredData: true });

            fireDB.collection("users").doc(member.uid).collection("chats").doc(snap.id)
                .set(chatShortcut)
                .catch(err => functions.logger.info(err, { structuredData: true }))
        })
        // perform desired operations ...
    });

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
