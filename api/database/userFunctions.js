import { uCol } from "./firebaseConnect.js";

export async function getUserId(req, res) {
    const {email} = req.params;

    if (!email) {
        return res.status(400).send({message: "Missing user email"});
    }

    try {
        // Retrieve user document
        const admin = atob(email);
        const snapshot = await uCol.where("email", "==", admin).get();
        if (snapshot.empty) {
            return res.status(400).send({message: "Not a valid user."})
        } else if (snapshot.docs.length > 1) {
            throw new Error("Duplicate users found.")
        }
        const userId = snapshot.docs[0].id

        // Send user ID
        return res.send(userId)

    } catch (err) {
        console.log(err)
        res.status(500).send({error: err, message: "Error occurred while attempting to retrieve user ID."})
    }
}