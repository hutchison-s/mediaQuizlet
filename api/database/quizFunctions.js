import { deleteAudioDocsFromPrompts } from "./audioFunctions.js";
import { deleteAssociatedFiles } from "./fileFunctions.js";
import { deleteAllResponses } from "./responseFunctions.js";
import { fieldValue, qCol, uCol } from "./firebaseConnect.js";
import { sendEmail } from "../nodemailer/emailFunctions.js";

export async function getAllQuizzes(req, res) {
    try {
        const snapshots = await qCol.get();
        if (snapshots.empty) {
            throw new Error("No quizzes exist")
        }
        const docs = snapshots.map(doc => doc.data())

        return res.send(docs);

    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err, message: "Error occurred while attempting to retrieve quizzes."})
    }
}

export async function getAllQuizzesByUser(req, res) {
    const {userId} = req.params;

    if (!userId) {
        return res.status(400).send({message: "Invalid user id"});
    }

    try {
        // Retrieve user document
        const uRef = uCol.doc(userId);
        const uDoc = await uRef.get();

        if (!uDoc.exists) {
            throw new Error("User does not exist.")
        }

        const user = uDoc.data();

        const {quizzes, email} = user;

        // Transform list of quiz IDs to quiz list info
        const qList = []
        for (const quizId of quizzes) {
            const qRef = qCol.doc(quizId);
            const qDoc = await qRef.get();
            if (!qDoc.exists) {
                throw new Error("Quiz does not exist.")
            }
            const quiz = qDoc.data();
            const {title, description, URL, expires, questions, timeLimit} = quiz;
            const exp = new Date(expires);
            exp.setFullYear(exp.getFullYear() - 1);
            qList.push({ title: title, description: description, URL: URL, created: exp.toISOString(), length: questions.length, timeLimit: timeLimit});
        };
        
        // Send list and email
        return res.send({admin: email, quizzes: qList})

    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err, message: "Error occurred while attempting to retrieve quizzes"})
    }
}

export async function newQuiz(req, res) {
    const {admin, title, description, password, expires, questions, status, timeLimit, associatedFiles} = req.body;

    if (!admin, !password || !expires || !questions || !status) {
        return res.status(400).send({message: "Not a valid request body. Missing required fields."})
    }
    const nQ = {
        admin: admin.toLowerCase().trim(),
        title,
        description: description ? description : '',
        password,
        expires,
        questions,
        status,
        associatedFiles: associatedFiles ? associatedFiles : new Array(),
        timeLimit,
        responses: new Array()
    }
    try {
        // Create new document
        const newDoc = await qCol.add(nQ);

        // Add to existing or create new user document
        const userSnapshot = await uCol.where("email", "==", admin).get();
        if (userSnapshot.empty) {
            await uCol.add({email: admin, quizzes: [newDoc.id]})
        } else if (userSnapshot.docs.length > 1) {
            throw new Error("Duplicate users found.")
        } else {
            const userId = userSnapshot.docs[0].id;
            await uCol.doc(userId).update({quizzes: fieldValue.arrayUnion(newDoc.id)})
        }
        // Add document id to quiz document so it's accessible client-side
        const quizId = newDoc.id;

        await qCol.doc(newDoc.id).update({quizId: newDoc.id, URL: "https://mediaquizlet.netlify.app/quizzer/"+newDoc.id})

        // Retrieve Newly Created Quiz
        const qRef = qCol.doc(quizId);
        const qDoc = await qRef.get();
        if (!qDoc.exists) {
            throw new Error("Quiz does not exist.")
        }
        const newQuiz = qDoc.data();

        // Send email to admin with quiz link and password
        await sendEmail(newQuiz)

        return res.send(newQuiz)
    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err, message: "Could not create document."})
    }
}

// Returns essential quiz object for quiz takers
export async function getQuiz(req, res) {
    const {quizId} = req.params;

    if (!quizId) {
        return res.status(400).send({message: "Missing quiz id"});
    } 

    try {
        // Retrieve Quiz
        const qRef = qCol.doc(quizId);
        const qDoc = await qRef.get();
        if (!qDoc.exists) {
            throw new Error("Quiz does not exist.")
        }
        const quiz = qDoc.data();

        const {admin, title, description, questions, status, timeLimit} = quiz;

        // Strip quiz to essential information for quizzing
        for (const q of questions) {
            delete q.response.correct
        }
        const essentialQuiz = {
            quizId,
            admin,
            title,
            description,
            status,
            timeLimit,
            questions: questions
        }

        // Send essential quiz
        return res.send(essentialQuiz);
    } catch (err) {
        console.log(err);
        return res.status(500).send({error: err, message: "Error retrieving quiz."})
    }
}

export async function getFullQuiz(req, res) {
    const {quizId} = req.params;
    if (!quizId) {
        return res.status(400).send({message: "Missing quiz id"});
    }
    try {
        const qRef = qCol.doc(quizId);
        const qDoc = await qRef.get();
        if (!qDoc.exists) {
            throw new Error("Quiz does not exist.")
        }
        const quiz = qDoc.data();
        return res.send(quiz);
    } catch (err) {
        console.log(err);
        return res.status(500).send({error: err, message: "Error retrieving quiz."})
    }
}

export async function updateQuiz(req, res) {
    const {status, timeLimit, reset} = req.body;
    const {quizId} = req.params;
    
    if ((!status && !timeLimit && !reset) || !quizId) {
        return res.status(400).send({message: "Invalid request. Missing required fields."});
    }

    try {
        // Retrieve quiz document
        const qRef = qCol.doc(quizId);
        const qDoc = await qRef.get();

        if (!qDoc.exists) {
            throw new Error("Quiz does not exist.")
        }

        const oldQuiz = qDoc.data();

        // Set updateData based on which variable was present in request body
        const updateData = {}
        if (reset) {
            await deleteAllResponses(updateData.responses);
            updateData.responses = new Array();
        } else if (status) {
            updateData.status = oldQuiz.status == "open" ? "closed" : "open";
        } else if (timeLimit) {
            updateData.timeLimit = timeLimit;
        }

        // Update document
        await qRef.update(updateData);
        
        // Retrieve updated quiz object
        const data = (await qRef.get()).data()
        
        // Return new quiz object
        return res.send(data)

    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Error updating quiz."})
    }

}

export async function deleteQuiz(req, res) {

    const {quizId} = req.params;
    if (!quizId) {
        return res.status(400).send({message: "Invalid request. Missing quizId from request body."});
    }
    console.log("Attempting to delete "+req.params.quizId)
    try {
        // Retrieve quiz document
        const qRef = qCol.doc(quizId);
        const qDoc = await qRef.get();

        if (!qDoc.exists) {
            throw new Error("Quiz does not exist.")
        }

        const quiz = qDoc.data();
        
        const {associatedFiles, questions, responses, admin} = quiz;
        
        // Delete all associated files from quiz
        if (associatedFiles) {
            await deleteAssociatedFiles(associatedFiles);
        }
        
        // Delete all audio documents from prompts
        if (questions) { 
            await deleteAudioDocsFromPrompts(questions);
        }

        // Delete all responses
        if (responses ) {     
            await deleteAllResponses(quizId, responses);
        }
        
        // Delete reference from admin user document
        const uQuery = uCol.where("email", "==", admin)
        const uSnapshot = await uQuery.get();

        if (uSnapshot.empty) {
            throw new Error("Admin user does not exist")
        }

        if (uSnapshot.docs.length > 1) {
            throw new Error("Duplicate users found")
        }

        const userId = uSnapshot.docs[0].id
        await uCol.doc(userId).update({quizzes: fieldValue.arrayRemove(quiz.quizId)})

        // Delete quiz document
        await qRef.delete();

        console.log("Quiz " + quizId + " deleted successfully.");
        return res.send({status: "Complete"})
    } catch (err) {
        return res.status(500).send({error: err.message, message: "Could not delete document."})
    }
}
