import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: {} });

import authenticate from "./middleware/auth.js";
import { createDocument, getQuizzerInfo, addResponse, updateQuiz, resetQuiz, deleteDoc, deleteExpired } from "./firebase/docFuncs.js";
import { handleAudioUpload } from "./firebase/fileFuncs.js";

const port = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Create New Quiz & Upload files
app.post("/audio/upload", upload.single("files"), async(req, res) => {
  console.log("audio upload initiated");
  const file = req.file
  const uploaded = await handleAudioUpload(file);
  console.log("uploaded "+uploaded.path)
  res.send(uploaded);
})

app.post("/createQuiz", upload.single("files"), async (req, res) => {
  console.log("quiz creation initiated")
  try {
    const {questions, timeLimit, password, expires, status, associatedFiles} = req.body;
    const message = await createDocument(JSON.parse(questions), timeLimit, password, expires, status, JSON.parse(associatedFiles));
    console.log("received\n"+message)
    res.send(message);
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
});

// Retrieve Quiz Questions and Info

app.get("/quiz/:code", async (req, res) => {
  try {
    console.log(req.params.code + " requested");
    const data = await getQuizzerInfo(req.params.code)
    res.send(data);
  } catch(err) {
    res
      .status(400)
      .send({ message: "Error retrieving quiz document", error: err });
  }
});

// Add response to quiz

app.post("/quiz/:code/response", upload.array("photos"), async (req, res) => {
  try {
    const id = req.params.code;
    const update = await addResponse(req, id);
    res.send(update);
    console.log("New Response to quiz " + id + " received."); 
  } catch(err) {
    res.status(400).send({message: "Error in sending response", error: err})
  }
});

// Get admin-level quiz info

app.get("/quiz/:code/admin", authenticate, async (req, res) => {
  try {
    console.log(req.params.code + " requested");
    res.send(req.quizData); // Send the authenticated data from the request object
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: "Error retrieving quiz document", error: err.message });
  }
});

// Update quiz data

app.patch("/quiz/:code/admin", authenticate, async (req, res) => {
  try {
    const updated = await updateQuiz(req.body, req.params.code);
    res.send(updated);
  } catch (err) {
    console.log(err)
    res
      .status(err.status).send({ message: "Error retrieving quiz document", error: err.message });
  }
})

// Reset quiz and remove responses

app.patch("/quiz/:code/admin/reset", authenticate, async (req, res) => {
  try {
      const updated = await resetQuiz(req.params.code);
      res.send(updated)
  } catch(err) {
    console.log(err)
    res
      .status(err.status).send({ message: "Error retrieving quiz document", error: err.message });
  }
})

// Delete quiz and associated files

app.delete("/quiz/:code/admin", authenticate, async (req, res) => {
  try {
      const updated = await deleteDoc(req.params.code);
      res.send(updated)
  } catch(err) {
    console.log(err)
    res
      .status(err.status).send({ message: "Error retrieving quiz document", error: err.message });
  }
})

// Cron Function

app.use("/api/cron", deleteExpired)

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
