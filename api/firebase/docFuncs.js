import {db, storage} from "./firebaseConnect";
const qCol = db.collection("quizzes");

export async function handleFileUploads(req) {
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
  
  export async function createDocument(qList, timeLimit, password, expires, status) {
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

  export async function getQuizzerInfo(code) {
    const docReq = await qCol.doc(code).get()
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
    return sendData;
  }

  export async function addResponse(body, code) {
    const { user, timestamp, responses } = body;
    const updateData = {
        user: user,
        timestamp: timestamp,
        responses: responses,
      }
      const docUpdate = await qCol.doc(code).update('responses', fv.arrayUnion(updateData));
      return docUpdate;
  }

  export async function updateQuiz(body, code) {
    const {status} = body;
    if (status) {
      const myDoc = qCol.doc(code)
      await myDoc.update({status: status})
      const updated = await myDoc.get();
      return updated.data();
    } else {
      throw new Error("No status present in request body")
    }
  }

  export async function resetQuiz(code) {
    const myDoc = qCol.doc(code)
    await myDoc.update({responses: new Array()})
    const updated = await myDoc.get();
    return updated.data();
  }