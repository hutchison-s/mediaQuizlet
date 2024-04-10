import { deleteFile } from "./fileFunctions.js";
import { rCol, qCol, fieldValue } from "./firebaseConnect.js";

export async function newResponse(req, res) {
    const {user, timeStarted} = req.body;
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
    const {answers, timeSubmitted, associatedFiles} = req.body;
    const {quizId, responseId} = req.params;
    if (!responseId || !quizId || !timeSubmitted || !answers) {
        res.status(400).send({message: "Not a valid request body. Missing required fields."});
        return;
    }
    try {
        const ref = rCol.doc(responseId);
        const oldDoc = (await ref.get()).data();
        if (oldDoc && oldDoc.quizId == quizId) {
            const docUpdate = {
                timeSubmitted: timeSubmitted,
                answers: answers,
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
        res.status(400).send({message: "Not a valid request body. Missing required fields."});
        return;
    }
    try {
        const response = (await rCol.doc(responseId).get()).data()
        if (response && response.quizId == quizId) {
            for (let f of response.associatedFiles) {
                await deleteFile(f);
            }
            await rCol.doc(responseId).delete();
            await qCol.doc(quizId).update({responses: fieldValue.arrayRemove(responseId)})
            res.send({message: "Complete"})

        } else {
            res.status(400).send({message: "Response does not belong to the quiz with this id."})
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Error retrieving response."})
    }
}