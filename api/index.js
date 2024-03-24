import express from "express";
const app = express();
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

import admin from 'firebase-admin'

// import config from "../api/firebase.config.js";
import {credential} from "../api/firebaseAdmin.config.js"

const port = process.env.PORT || 8000;
const fbApp = admin.initializeApp({credential: admin.credential.cert(credential), storageBucket: "audioquizlet.appspot.com"});

const db = admin.firestore(fbApp);
const storage = admin.storage(fbApp);
const qCol = db.collection("quizzes");
const fv = admin.firestore.FieldValue;


// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
  
}));

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

async function handleFileUploads(req) {
  const {files, body} = req;
  const dt = Date.now();
  const expires = new Date();
  expires.setFullYear(expires.getFullYear()+1)
  const qList = JSON.parse(body.questions);
  try {
    for (let i = 0; i < files.length; i++) {
      const cloudFile = storage.bucket().file("files/" + files[i].originalname.split(".")[0] + dt+i)
      console.log("file ref:"+cloudFile)
      await cloudFile.save(files[i].buffer, {contentType: files[i].mimetype})
      const downLink = await cloudFile.getSignedUrl({action: "read", expires: expires.toISOString()})
      console.log("link retrieved: "+downLink)
      qList[i].file = downLink;
    }
    return qList;
  } catch (err) {
    console.log("Error uploading files. "+err);
    throw new Error("Error uploading files");
  }
  
}

async function createDocument(qList, timeLimit, password, expires, status) {
  try {
    const newDoc = {
      questions: qList,
      timeLimit: timeLimit || null,
      password: password,
      responses: [],
      expires: expires,
      status: status
    };

    const docAdded = await qCol.add(newDoc);
    console.log("Document written with ID:", docAdded.id);
    const code = docAdded.id;
    return {
      message: "Upload successful",
      url: `https://audioquizlet.netlify.app/quizzer?id=${code}`
    }
  } catch (err) {
    console.error("Error adding document:", err);
    throw new Error("Error occurred while attempting to create new document.")
  }
}

// Upload Files
app.post("/upload", upload.array("files", 12), async (req, res) => {
  console.log("called upload")
  try {
    const {timeLimit, password, expires, status} = req.body;
    const qList = await handleFileUploads(req);
    console.log("qList\n"+qList)
    const message = await createDocument(qList, timeLimit, password, expires, status);
    console.log("received\n"+message)
    res.send(message);
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
});

app.get("/quiz/:code", async (req, res) => {
  try {
    console.log(req.params.code + " requested");
    const docReq = await qCol.doc(req.params.code).get()
    const data = docReq.data()
    if (data == null) {
      throw new Error("No such document")
    }
    const sendData = {
      questions: new Array(),
      timeLimit: data.timeLimit,
      status: data.status
    }
    for (const q of data.questions) {
      sendData.questions.push({
        title: q.title,
        options: q.options,
        limit: q.limit,
        file: q.file,
      })
    }
    console.log(sendData);
    res.send(sendData);
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

app.get("/quiz/:code/admin", async (req, res) => {
  
  try {
      const authheader = req.headers['authorization']
      console.log(req.params.code + " requested");
      if (!authheader) {
          let err = new Error('You are not authenticated! No header present');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          throw err;
      }
      const decodedCreds = Buffer.from(authheader.split(' ')[1],'base64').toString()
      const [code, pass] = decodedCreds.split(':')
      console.log(code+":"+pass)
      const docReq = await qCol.doc(code).get()
      const data = docReq.data()
      if (data == null) {
        let err = new Error("No such document");
        console.log("no such document")
        err.status = 400;
        throw err;
      }
      if (pass == data.password) {
          console.log(data);
          res.send(data);
      } else {
          let err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          throw err;
      }
  } catch(err) {
    console.log(err)
    res
      .status(err.status).send({ message: "Error retrieving quiz document", error: err.message });
  }
})

app.patch("/quiz/:code/admin", async (req, res) => {
  try {
    const authheader = req.headers['authorization']
    console.log(req.params.code + " requested");
    if (!authheader) {
        let err = new Error('You are not authenticated! No header present');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        throw err;
    }
    const decodedCreds = Buffer.from(authheader.split(' ')[1],'base64').toString()
    const [code, pass] = decodedCreds.split(':')
    console.log(code+":"+pass)
    const myDoc = qCol.doc(code)
    const docReq = await myDoc.get()
    const data = docReq.data()
    if (data == null) {
      let err = new Error("No such document");
      console.log("no such document")
      err.status = 400;
      throw err;
    }
    if (pass == data.password) {
        console.log(data);
        const {status} = req.body;
        if (status) {
          await myDoc.update({status: status})
          const updated = await myDoc.get();
          res.send(updated.data())
        } else {
          console.log("No status present in request body")
        }
    } else {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        throw err;
    }
} catch(err) {
  console.log(err)
  res
    .status(err.status).send({ message: "Error retrieving quiz document", error: err.message });
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
