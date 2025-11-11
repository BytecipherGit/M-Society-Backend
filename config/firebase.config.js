let admin = require("firebase-admin");
// let serviceAccount = require("./serviceAccountKey.json");

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //databaseURL: "https://sample-project-e1a84.firebaseio.com"
});

module.exports = admin;
