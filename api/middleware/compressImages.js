import sharp from "sharp";
import {storage} from "../firebase/firebaseConnect.js"

async function compressOne(photo) {
    try {
        console.log(`compressing ${photo.originalname}`)
        const comp = await sharp(photo.buffer).jpeg({ quality: 50 }).toBuffer();
        return {
            originalname: photo.originalname,
            buffer: comp,
            mimetype: 'image/jpeg'
        };
    } catch (err) {
        throw new Error(`Error compressing photo "${photo.originalName}": ${err.message}`);
    }
}

async function compressAll(photos) {
    try {
        const compressed = await Promise.all(photos.map(photo => compressOne(photo)));
        return compressed;
    } catch (err) {
        console.error("Error compressing photos:", err);
        throw new Error("Error compressing photos: " + err.message);
    }
}

async function uploadOne(photo, index) {
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    console.log("uploading: ",photo.originalname)
    try {
    const fileName = `files/images/${photo.originalname.split(".")[0]}_${dt}_${index}`;
    const cloudFile = storage.bucket().file(fileName);

    return cloudFile.save(photo.buffer, { contentType: photo.mimetype })
        .then(() => cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() }))
        .then((downLink) => ({ name: cloudFile.name, link: downLink[0] }))
        .catch((err) => {
            console.error("Error uploading file:", err);
            throw new Error("Error uploading file: " + err.message);
        });
    } catch (err) {
        throw new Error(`Error uploading photo "${photo.originalName}": ${err.message}`);
    }
}

async function uploadAll(compressed) {
    try {
        const photoNames = await Promise.all(compressed.map((photo, index) => uploadOne(photo, index)));
        return photoNames;
    } catch (err) {
        console.error("Error uploading photos:", err);
        throw new Error("Error uploading photos: " + err.message);
    }
}

export default async function compressAndUpload(photos) {
    console.log(`Compressing ${photos.length} photos.`);
    const compressed = await compressAll(photos);
    console.log(`Uploading ${compressed.length} compressed photos.`);
    const photoNames = await uploadAll(compressed);
    console.log(`Successfully uploaded ${photoNames.length} photos.`);
    return photoNames;
}
