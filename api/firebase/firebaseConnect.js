import admin from 'firebase-admin'
import {credential} from "./firebaseAdmin.config.js"

const fbApp = admin.initializeApp({credential: admin.credential.cert(credential), storageBucket: "audioquizlet.appspot.com"});

export const db = admin.firestore(fbApp);
export const storage = admin.storage(fbApp);
export const fieldValue = admin.firestore.FieldValue;