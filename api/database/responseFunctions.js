import { deleteAudioDoc, deleteAudioDocsFromAnswers } from "./audioFunctions.js";
import { deleteAssociatedFiles, deleteFile } from "./fileFunctions.js";
import { rCol, qCol, fieldValue } from "./firebaseConnect.js";

export async function newResponse(req, res) {
    const {user, timeStarted } = req.body;
    const {quizId} = req.params;
    if (!user || !quizId || !timeStarted) {
        res.status(400).send({message: "Not a valid request body. Missing required fields."});
        return;
    }
    try {
        const newDoc = {
            user: user,
            quizId: quizId,
            timeStarted: timeStarted,
            timeSubmitted: null,
            answers: new Array(),
            associatedFiles: new Array()
        }
        const ref = await rCol.add(newDoc);
        await ref.update({responseId: ref.id});
        await qCol.doc(quizId).update({responses: fieldValue.arrayUnion(ref.id)})
        const data = (await ref.get()).data();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Could not create response document."})
    }
}

export async function getAllResponses(req, res) {
    const {quizId} = req.params;
    if (!quizId) {
        res.status(400).send({message: "Invalid quiz id"});
        return;
    }
    try {
        const responses = [];
        const query = await rCol.where("quizId", "==", quizId).get();
        query.forEach(response => {
            responses.push(response.data())
        })
        res.send(responses);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Error retrieving responses for this quiz."})
    }
}

export async function getOneResponse(req, res) {
    const {quizId, responseId} = req.params;
    if (!quizId || !responseId) {
        res.status(400).send({message: "Not a valid request body. Missing required fields."});
        return;
    }
    try {
        const response = (await rCol.doc(responseId).get()).data()
        if (response && response.quizId == quizId) {
            res.send(response);
        } else {
            res.status(400).send({message: "Response does not belong to the quiz with this id."})
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Error retrieving response."})
    }
}

export async function updateResponse(req, res) {
    const {answers, timeSubmitted, associatedFiles, scores} = req.body;
    console.log("api received associated: ", associatedFiles);
    const {quizId, responseId} = req.params;
    if (!responseId || !quizId) {
        res.status(400).send({message: "Not a valid request body. Missing required fields."});
        return;
    }
    console.log(answers)
    if (!timeSubmitted || !answers) {
        if (scores) {
            const ref = rCol.doc(responseId);
            const {answers} = (await ref.get()).data();
            for (let i = 0; i<scores.length; i++) {
                answers[i] = scores[i];
            }
            await ref.update({answers: answers});
            res.send((await ref.get()).data())
            return;
        } else {
            res.status(400).send({message: "Not a valid request body. Missing required fields."});
            return;
        }
    }
    try {
        const ref = rCol.doc(responseId);
        const oldDoc = (await ref.get()).data();
        const quiz = (await qCol.doc(quizId).get()).data();
        const {questions} = quiz;
        console.log(answers)
        const graded = Object.values(answers).map((a, idx) => {
            const q = questions[idx];
            switch(q.type) {
                case "MC":
                    return {answer: q.options[a.answer], score: a.answer == q.correct ? q.pointValue : 0}
                case "SA":
                    let correct = new RegExp(q.correct.trim().replace(/[^\w-]/g, ""), "i")
                    return {answer: a.answer, score: correct.test(a.answer.trim().replace(/[^\w-]/g, "")) ? q.pointValue : 0}
                default:
                    return a;
            }
        })
        if (oldDoc && oldDoc.quizId == quizId) {
            const docUpdate = {
                timeSubmitted: timeSubmitted,
                answers: graded,
                associatedFiles: associatedFiles || null
            }
            await ref.update(docUpdate);
            res.send({message: "Complete"});
        } else {
            res.status(400).send({message: "Response does not belong to the quiz with this id."})
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Could not update response document."})
    }
}



export async function deleteOneResponse(req, res) {
    const {quizId, responseId} = req.params;

    if (!quizId || !responseId) {
        return res.status(400).send({message: "Not a valid request body. Missing required fields."});
    }
    try {
        await deleteResponseAndFiles(quizId, responseId)
        console.log("Deleted " + responseId);
        return res.send({message: "Complete"})
    } catch (err) {
        console.log(err);
        return res.status(500).send({error: err, message: "Error retrieving response."})
    }
}

export async function deleteResponseAndFiles(quizId, responseId) {
    console.log("Attempting to delete response " + responseId);

    // Retrieve response doc
    const rRef = rCol.doc(responseId);
    const rSnapshot = await rRef.get();

    if (!rSnapshot.exists) {
        throw new Error("Response does not exist.");
    }

    const response = rSnapshot.data();

    // Retrieve quiz doc
    const qRef = qCol.doc(quizId);     
    const qSnapshot = await qRef.get();

    if (!qSnapshot.exists) {
        throw new Error("Quiz does not exist.");
    }

    const quiz = qSnapshot.data();

    if (response.quizId !== quizId) {
        throw new Error("Response does not belong to the quiz with this id.");
    };

    // Delete all associated files from response
    await deleteAssociatedFiles(response.associatedFiles);

    // Delete audio documents in audio and recording responses
    await deleteAudioDocsFromAnswers(quiz.questions, response.answers);

    // Delete response document
    await rRef.delete();

    // Delete response id from associated quiz
    await qRef.update({responses: fieldValue.arrayRemove(responseId)});
}

export async function deleteAllResponses(quizId, responses) {
    if (!responses || responses.length == 0) return;
    const promises = responses.map(responseId => deleteResponseAndFiles(quizId, responseId));
    await Promise.all(promises)
}