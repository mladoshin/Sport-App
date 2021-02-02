const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.sayHello = functions.https.onCall((data, context) => {
    return data.name
})

exports.addCoachRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            coach: true
        });
    }).then(() => {
        return {
            coach: true,
            message: data.email + " is now a coach!"
        }
    }).catch(err => {
        return err;
    });
})
