// import compressAndUpload from '../middleware/compressImages.js';
import {storage} from './firebaseConnect.js'
const bucket = storage.bucket();

export async function handleAudioUpload(file) {
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    try {
        const [name, tail] = file.originalname.split(".")
        let path = `files/audio/${name}_${dt}.${tail}`;
        console.log("uploading "+path);
        const cloudFile = bucket.file(path);
        const response = cloudFile.save(file.buffer, { contentType: file.mimetype })
            .then(() => {
                return cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() });
            })
            .then((downLink) => {
                console.log("link retrieved: " + downLink);
                return {link: downLink[0], path: cloudFile.name}
            })
            .catch(err => {
                throw new Error("Error while saving file: "+err)
            })
        return response;
    } catch (err) {
        throw new Error(err.message)
    }
}