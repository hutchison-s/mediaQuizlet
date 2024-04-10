import { bucket } from "./firebaseConnect.js";

export async function deleteFile(name) {
    await bucket.file(name).delete();
}

export async function uploadAudio(req, res) {
    return await upload(req, res, "audio")
}

export async function uploadImage(req, res) {
    return await upload(req, res, "images")
}

async function upload(req, res, collection) {
    const file = req.file;
    if (!file) {
        res.status(400).send({message: "Missing file from request body."});
        return;
    }
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    try {
        const tail = file.originalname.split(".")[1]
        let fileName = `files/${collection}/${dt}_${randomString(8)}.${tail}`;
        const cloudFile = storage.bucket().file(fileName);

        return cloudFile.save(file.buffer, { contentType: file.mimetype })
            .then(() => cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() }))
            .then((downLink) => ({link: downLink[0], path: cloudFile.name}))
            .catch((err) => {
                console.error("Error uploading file:", err);
                throw new Error("Error uploading file: " + err.message);
            });
    } catch (err) {
        console.log(err)
        res.status(500).send({error: err, message: `Error uploading file: ${err.message}`});
    }
}

function randomString(chars) {
    const upper = ()=>Math.floor(Math.random() * 26) + 65;
    const lower = ()=>Math.floor(Math.random() * 26) + 97;
    const number = ()=>Math.floor(Math.random() * 10) + 48;
    const choices = [upper, lower, number]
    const choice = ()=>{
        let func = choices[Math.floor(Math.random() * 3)]
        return func()
    };
    let str = ""
    for (let i=0; i<chars; i++) {
        let c = choice();
        console.log(c)
        let char = String.fromCharCode(c);
        str += char;
    }
    let s = Date.now();
    return str+"_"+s;
}