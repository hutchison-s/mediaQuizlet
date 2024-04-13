import admin from 'firebase-admin'
import {credential} from "./firebaseAdmin.config.js"

const fbApp = admin.initializeApp({credential: admin.credential.cert(credential), storageBucket: "audioquizlet.appspot.com"});

export const db = admin.firestore(fbApp);
export const qCol = db.collection("quizzes");
export const rCol = db.collection("responses");
export const aCol = db.collection("audio");
export const bucket = admin.storage(fbApp).bucket();
export const fieldValue = admin.firestore.FieldValue;