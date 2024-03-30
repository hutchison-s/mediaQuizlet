import sharp from "sharp";

async function compressOne(photo) {
    try {
        const comp = await sharp(photo).jpeg({ quality: 50 }).toBuffer();
        return {
            originalname: photo.originalName,
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

async function uploadPhotos(compressed) {
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const photoUploadPromises = compressed.map((photo, index) => {
        const fileName = `files/${photo.originalname.split(".")[0]}_${dt}_${index}`;
        const cloudFile = storage.bucket().file(fileName);

        return cloudFile.save(photo.buffer, { contentType: photo.mimetype })
            .then(() => cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() }))
            .then((downLink) => ({ name: cloudFile.name, link: downLink }))
            .catch((err) => {
                console.error("Error uploading file:", err);
                throw new Error("Error uploading file: " + err.message);
            });
    });

    try {
        const photoNames = await Promise.all(photoUploadPromises);
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
    const photoNames = await uploadPhotos(compressed);
    console.log("Successfully uploaded:", photoNames);
    return photoNames;
}
