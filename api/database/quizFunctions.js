import { deleteAudioDoc } from "./audioFunctions.js";
import { deleteFile } from "./fileFunctions.js";
import { fieldValue, qCol, rCol, uCol } from "./firebaseConnect.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';


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

export async function getUserId(req, res) {
    const {email} = req.params;
    if (!email) {
        return res.status(400).send({message: "Invalid user email"});
    }
    const admin = atob(email);
    const snapshot = await uCol.where("email", "==", admin).get();
    if (snapshot.empty) {
        return res.status(400).send({message: "Not a valid user."})
    }
    res.send(snapshot.docs[0].id)
}

export async function getAllQuizzesByUser(req, res) {
    const {userId} = req.params;
    if (!userId) {
        return res.status(400).send({message: "Invalid user id"});
    }
    try {
        const doc = await uCol.doc(userId).get();
        const data = doc.data();
        const {quizzes, email} = data;
        console.log(quizzes)
        const qList = [];
        for (const q of quizzes) {
            const qDoc = await qCol.doc(q).get();
            const {title, description, URL, expires, questions, timeLimit} = qDoc.data();
            const exp = new Date(expires);
            exp.setFullYear(exp.getFullYear() - 1);
            qList.push({ title: title, description: description, URL: URL, created: exp.toISOString(), length: questions.length, timeLimit: timeLimit});
        }
        res.send({admin: email, quizzes: qList})
    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err, message: "Error occurred while attempting to retrieve quizzes"})
    }
}

export async function newQuiz(req, res) {
    const {admin, title, description, password, expires, questions, status, timeLimit, associatedFiles} = req.body;
    if (!admin, !password || !expires || !questions || !status) {
        console.log(password)
        res.status(400).send({message: "Not a valid request body. Missing required fields."})
    } else {
        const nQ = {
            admin,
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
           const newDoc = await qCol.add(nQ);
           const adminDoc = await uCol.where("email", "==", admin).get();
           if (adminDoc.empty) {
                await uCol.add({email: admin, quizzes: [newDoc.id]})
           } else {
                const user = adminDoc.docs[0].id;
                await uCol.doc(user).update({quizzes: fieldValue.arrayUnion(newDoc.id)})
           }
            console.log(newDoc.id)
            await qCol.doc(newDoc.id).update({quizId: newDoc.id, URL: "https://audioquizlet.netlify.app/quizzer/"+newDoc.id})

            const data = (await qCol.doc(newDoc.id).get()).data()
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.BREVO_USER,
                    pass: process.env.BREVO_PASS
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: admin,
                subject: "New Audio Quizlet Created!",
                html: `<h1>Audio Quizlet</h1><h2>Here's a link to your newly created quizlet:</h2> <a href="https://audioquizlet.netlify.app/quizzer/${newDoc.id}">https://audioquizlet.netlify.app/quizzer/${newDoc.id}</a><br></br><p><a href="https://audioquizlet.netlify.app/generator">Create another!</a></p>`
            }
            const info = await transporter.sendMail(mailOptions).catch(err => console.log);
            console.log(info.messageId)
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
            const ref = qCol.doc(quizId);     
            const doc = await ref.get();
            if (!doc.exists) {
                res.status(404).send({message: "No quiz with this ID was found."});
                return;
            }
            const quiz = doc.data();
            delete quiz.responses;
            delete quiz.password;
            delete quiz.expires;
            delete quiz.associatedFiles;
            for (const q of quiz.questions) {
                delete q.correct
            }
            console.log(quiz)
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
        
        if (reset) {
            for (let r of oldQuiz.responses) {
                const response = (await rCol.doc(r).get()).data()
                for (let f of response.associatedFiles) {
                    await deleteFile(f);
                }
                await rCol.doc(r).delete();
            }
            updateData.responses = new Array();
        }
        if (status) {
            updateData.status = oldQuiz.status == "open" ? "closed" : "open";
        }
        if (timeLimit) {
            updateData.timeLimit = timeLimit;
        }
        await doc.update(updateData);
        const data = (await doc.get()).data()
        res.send(data)
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
        // Delete all associated files
        for (let f of associatedFiles) {
            await deleteFile(f);
            console.log("deleted "+f)
        }
        // Delete all questions
        for (let q of quiz.questions) {
            for (let p of q.prompts) {
                if (p.type === 'audio') {
                    await deleteAudioDoc(p.path)
                }
            }
            
        }
        // Delete all responses
        for (let r of quiz.responses) {
            const response = (await rCol.doc(r).get()).data()
            for (let f of response.associatedFiles) {
                await deleteFile(f);
            }
            for (const [a, idx] of response.answers.entries()) {
                if (quiz.questions[idx].type === 'AUD' || quiz.questions[idx].type === 'REC') {
                    await deleteAudioDoc(a.answer)
                }
            }
            console.log("Deleting response "+r.responseId)
            await rCol.doc(r).delete();
        }
        // Delete reference from admin user
        const userId = (await uCol.where("email", "==", quiz.admin).get()).docs[0].id
        await uCol.doc(userId).update({quizzes: fieldValue.arrayRemove(doc.id)})

        await doc.delete();
        console.log(doc.id+" deleted successfully.");
        res.send({status: "Complete"})
    } catch (err) {
        res.status(500).send({error: err, message: "Could not delete document."})
    }
    


}