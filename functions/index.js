const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.database()

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
            message: data.email + " is now "+data.role
        }
    }).catch(err => {
        return err;
    });
})

exports.getUserIP = functions.https.onCall((data, context) => {
     
    return admin.auth().getUserByEmail(data.email).then(user => {     
        return user.uid+"/user-info/geolocation"
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

exports.userDeleted = functions.auth.user().onDelete(user => {
    console.log("Email: " + user.email);
    return admin.database().ref("/" + user.uid + "/").remove()
})

exports.userCreated = functions.auth.user().onCreate(user => {
    console.log("Email: " + user.email);
})

exports.getUserGeolocation = functions.https.onCall((data, context) => {
    return admin.database().ref(data.uid+"/user-info/geolocation").once("value", snapshot => {
        return snapshot.val()
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
            var userList = Object.keys(obj).map(key => { return { name: obj[key]["user-info"].name, surname: obj[key]["user-info"].surname, uid: key, city: obj[key]["user-info"]["geolocation"].city, email: obj[key]["user-info"].email }})
            userList.forEach(user => {
                uids.push(user)
            });
            functions.logger.info(uids, { structuredData: true });

            return uids
        })
})
