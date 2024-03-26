import * as dotenv from "dotenv";
dotenv.config();

export default {
  firebaseConfig: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOM,
    projectId: "audioquizlet",
    storageBucket: process.env.BUCKET_URL,
    messagingSenderId: process.env.SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEAS_ID,
  },
};
