import sharp from "sharp";
export default async function compressImages(photos) {
    const dt = Date.now();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    try {
        const compressed = [];
        for (const photo of photos) {

            const comp = await sharp(photo).jpeg({quality: 50}).toBuffer()
            compressed.push({
                originalname: photo.originalName,
                buffer: comp,
                mimetype: 'image/jpeg'
            })
        }
    } catch (err) {
        console.log("Error compressing photos: "+err.message);
        throw new Error("Error compressing photos: "+err.message);
    }

    const photoUploadPromises = [];
    try {
        for (let i = 0; i < compressed.length; i++) {
            let fileName = "files/" + compressed[i].originalname.split(".")[0] + dt + i;
            const cloudFile = storage.bucket().file(fileName);
            console.log("file ref:" + cloudFile);
            const uploadPromise = cloudFile.save(compressed[i].buffer, { contentType: compressed[i].mimetype })
                .then(() => {
                    return cloudFile.getSignedUrl({ action: "read", expires: expires.toISOString() });
                })
                .then((downLink) => {
                    console.log("link retrieved: " + downLink);
                    return {name: cloudFile.name, link: downLink};
                })
                .catch((err) => {
                    console.log("Error uploading file:", err);
                    throw new Error("Error uploading file");
                });
            photoUploadPromises.push(uploadPromise);
        }

        // Wait for all file upload promises to resolve
        const photoNames = await Promise.all(photoUploadPromises);
        return photoNames;
    } catch (err) {
        console.log("Error uploading photos:", err);
        throw new Error("Error uploading photos: "+err.message);
    }
}