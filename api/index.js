import express from "express";
const app = express();
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import admin from 'firebase-admin'

// import config from "../api/firebase.config.js";
import {credential} from "../api/firebaseAdmin.config.js"

const port = process.env.PORT || 8000;
const fbApp = admin.initializeApp({credential: admin.credential.cert(credential)});

const db = admin.firestore(fbApp);
const storage = admin.storage(fbApp);
const qCol = db.collection("quizzes");
const fv = admin.firestore.FieldValue;


// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Upload Files
app.post("/upload", upload.array("files", 12), async (req, res) => {
  const dt = Date.now();
  const { password, timeLimit, questions } = req.body;
  const qList = JSON.parse(questions);
  try {
    for (let i = 0; i < req.files.length; i++) {
      const fRef = ref(storage, "files/" + req.files[i].originalname.split(".")[0] + dt);
      const snapshot = await uploadBytesResumable(fRef, req.files[i].buffer, {
        contentType: req.files[0].mimetype,
      });
      const downLink = await getDownloadURL(snapshot.ref);
      qList[i].file = downLink;
    }
  } catch (err) {
    console.log("Error uploading files.");
    res.status(400).send({ message: "Error uploading files", error: err });
  }

  let code;
  try {
    const newDoc = {
      questions: qList,
      timeLimit: timeLimit || null,
      password: password,
      responses: new Array(),
    }
    const docAdded = await qCol.add(newDoc)
    console.log("Document written with ID: ", docAdded.id);
    code = docAdded.id;
  } catch (err) {
    console.error("Error adding document.");
    res
      .status(400)
      .send({ message: "Error creating quiz document", error: err });
  }
  res.send({
    message: "Upload successful",
    url: `https://audioquizlet.netlify.app/quizzer?id=` + code,
  });
});

app.get("/quiz/:code", async (req, res) => {
  try {
    console.log(req.params.code + " requested");
    const docReq = await qCol.doc(req.params.code).get()
    const data = docReq.data()
    if (data == null) {
      throw new Error("No such document")
    }
    console.log(data);
    res.send(data);
  } catch(err) {
    res
      .status(400)
      .send({ message: "Error retrieving quiz document", error: err });
  }
  
});

app.post("/quiz/:code/response", async (req, res) => {
  try {
    const id = req.params.code;
    const { user, timestamp, responses } = req.body;
    const updateData = {
      user: user,
      timestamp: timestamp,
      responses: responses,
    }
    const docUpdate = await qCol.doc(id).update('responses', fv.arrayUnion(updateData));
    res.send(docUpdate);
    console.log("New Response to quiz " + id + " received."); 
  } catch(err) {
    res.status(400).send({message: "Error in sending response", error: err})
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
