import {db, storage, fieldValue} from './firebaseConnect.js'
const qCol = db.collection("quizzes");

export async function handleFileUploads(req) {
    const { files } = req;
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const qList = JSON.parse(req.body.questions);
    const fileUploadPromises = [];

    try {
        for (let i = 0; i < files.length; i++) {
            let fileName = "files/" + files[i].originalname.split(".")[0] + dt + i;
            const cloudFile = storage.bucket().file(fileName);
            console.log("file ref:" + cloudFile);
            const uploadPromise = cloudFile.save(files[i].buffer, { contentType: files[i].mimetype })
                .then(() => {
                    return cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() });
                })
                .then((downLink) => {
                    console.log("link retrieved: " + downLink);
                    qList[i].file = downLink;
                    return cloudFile.name;
                })
                .catch((err) => {
                    console.log("Error uploading file:", err);
                    throw new Error("Error uploading file");
                });
            fileUploadPromises.push(uploadPromise);
        }

        // Wait for all file upload promises to resolve
        const fileIds = await Promise.all(fileUploadPromises);
        return [qList, fileIds];
    } catch (err) {
        console.log("Error uploading files:", err);
        throw new Error("Error uploading files");
    }
    
  }
  
  export async function createDocument(qList, timeLimit, password, expires, status, associatedFiles) {
    try {
      const newDoc = {
        questions: qList,
        associatedFiles: associatedFiles,
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

  export async function deleteExpired() {
    const today = new Date().toISOString();
    try {
        const expQuery = qCol.where("expires", "<", today);
        const snapshots = await expQuery.get();
        
        if (snapshots.empty) {
            console.log("No expired documents found in database.");
            return;
        }

        for (const doc of snapshots.docs) {
            const quiz = doc.data();
            
            if (quiz.associatedFiles) {
                for (const fileName of quiz.associatedFiles) {
                    try {
                        await storage.bucket().file(fileName).delete();
                        console.log("File deleted: " + fileName);
                    } catch (err) {
                        console.log("Couldn't delete file: " + fileName);
                    }
                }
            }

            try {
                await doc.ref.delete();
                console.log("Document deleted: " + doc.id);
            } catch (err) {
                console.log("Error deleting document: " + doc.id);
            }
        }
    } catch (err) {
        console.error(err);
        throw new Error("Error occurred during deletion.");
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
      if (q.type == "multipleChoice") {
        sendData.questions.push({
          title: q.title,
          options: q.options,
          limit: q.limit,
          file: q.file,
          type: q.type
        })
      } else if (q.type = "shortAnswer") {
        sendData.questions.push({
          title: q.title,
          correct: q.correct,
          limit: q.limit,
          file: q.file,
          type: q.type
        })
      }
      
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
      const docUpdate = await qCol.doc(code).update('responses', fieldValue.arrayUnion(updateData));
      return docUpdate;
  }

  export async function updateQuiz(body, code) {
    if (body.status) {
      const {status} = body;
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