import { deleteFile } from "./fileFunctions.js";
import { qCol } from "./firebaseConnect.js";

export async function getAllQuizzes(req, res) {
    try {
        const snapshots = await qCol.get();
        const docs = [];
        snapshots.forEach(doc => {
            docs.push(doc.data())
        })
        res.send(docs);
    } catch (err) {
        console.log(err)
        res.status(500).send({error: err, message: "Error occurred while attempting to retrieve quizzes."})
    }
}

export async function newQuiz(req, res) {
    const {admin, password, expires, questions, status, associatedFiles, timeLimit} = req.body;
    if (!admin, !password || !expires || !questions || !status || !associatedFiles || !timeLimit) {
        console.log(password)
        res.status(400).send({message: "Not a valid request body. Missing required fields."})
    } else {
        const nQ = {
            admin,
            password,
            expires,
            questions,
            status,
            associatedFiles,
            timeLimit,
            responses: new Array()
        }
        try {
           const newDoc = await qCol.add(nQ);
            console.log(newDoc.id)
            await qCol.doc(newDoc.id).update({quizId: newDoc.id})
            const data = (await qCol.doc(newDoc.id).get()).data()
            res.send(data)
        } catch (err) {
            console.log(err)
            res.status(500).send({error: err, message: "Could not create document."})
        }
        
    }
}

export async function getQuiz(req, res) {
    const {quizId} = req.params;
    if (!quizId) {
        res.status(400).send({message: "Invalid quiz id"});
    } else {
        try {
            const doc = qCol.doc(quizId);
            const quiz = (await doc.get()).data();
            delete quiz.responses;
            delete quiz.password;
            delete quiz.expires;
            delete quiz.associatedFiles;
            for (const q of quiz.questions) {
                delete q.correct
            }
            res.send(quiz);
        } catch (err) {
            console.log(err);
            res.status(500).send({error: err, message: "Error retrieving quiz."})
        }
    }
}

export async function getFullQuiz(req, res) {
    const {quizId} = req.params;
    if (!quizId) {
        res.status(400).send({message: "Invalid quiz id"});
    } else {
        try {
            const doc = qCol.doc(quizId);
            const quiz = (await doc.get()).data();
            res.send(quiz);
        } catch (err) {
            console.log(err);
            res.status(500).send({error: err, message: "Error retrieving quiz."})
        }
    }
}

export async function updateQuiz(req, res) {
    const {status, timeLimit, reset} = req.body;
    if (!status && !timeLimit && !reset) {
        res.status(400).send({message: "Invalid request. Missing required fields."});
        return;
    }
    const {quizId} = req.params;
    if (!quizId) {
        res.status(400).send({message: "Invalid quiz id"});
        return;
    }
    try {
        const doc = qCol.doc(quizId);
        const oldQuiz = (await doc.get()).data();
        const updateData = {};
        if (status) {
            updateData.status = oldQuiz.status == "open" ? "closed" : "open";
        }
        if (timeLimit) {
            updateData.timeLimit = timeLimit;
        }
        if (reset) {
            updateData.responses = new Array();
        }
        doc.update(updateData);
        const data = (await doc.get()).data()
    } catch (err) {
        console.log(err);
        res.status(500).send({error: err, message: "Error updating quiz."})
    }

}

export async function deleteQuiz(req, res) {
    try {
        console.log(req.params.quizId)
        const id = req.params.quizId;
        const doc = qCol.doc(id);
        const quiz = (await doc.get()).data();
        const {associatedFiles} = quiz;
        for (let f of associatedFiles) {
            await deleteFile(f);
            console.log("deleted "+f)
        }
        await doc.delete();
        console.log(doc.id+" deleted successfully.");
        res.send({status: "Complete"})
    } catch (err) {
        res.status(500).send({error: err, message: "Could not delete document."})
    }
    


}