import admin from 'firebase-admin'
import {credential} from "./firebase/firebaseAdmin.config.js"

const fbApp = admin.initializeApp({credential: admin.credential.cert(credential), storageBucket: "audioquizlet.appspot.com"});

const db = admin.firestore(fbApp);
const storage = admin.storage(fbApp);

export default {db: db, storage: storage};