import { apiURL } from "../urls.js"

export async function fileToLinkPath(file) {
    const url = apiURL+`uploads/audio`;
    const fData = new FormData();
    fData.append('files', file);
    const response = await fetch(url, {
        method: 'POST',
        body: fData
    })
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error("Failed to upload file."+file.name)
    }
    
}

export async function processQuestions(questions) {
    const associatedFiles = [];
    const updatedQuestions = await Promise.all(questions.map(async q=>{
        const {file, qDataList, isComplete, ...otherProps} = q;
        const {id, associated} = await chunkAndUpload(file);
        for (const f of associated) {
            associatedFiles.push(f)
        }
        return {file: id, ...otherProps}
    }))

    return [updatedQuestions, associatedFiles]
}

export async function newAudio(mimeType) {
    const response = await fetch(apiURL+"uploads/audio", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({mimeType})
    }).then(res => res.json())
    return response.id;
}

export async function uploadChunk(id, data, index) {
    console.log("processing chunk", data)
    const formData = new FormData();
    formData.append('index', index);
    formData.append('chunk', new Blob([data], {type: "application/octet-stream"}));
    const response = await fetch(apiURL+`uploads/audio/${id}/chunks`, {
        method: 'POST',
        body: formData
    }).then(res => res.json())
    return response;
}

async function chunkAndUpload(file) {
    const id = await newAudio(file.type); // Create a new audio document and get its ID
    const chunkSize = 4 * 1024 * 1024; // 4 MB chunk size (adjust as needed)
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
            const chunkPaths = [];
            const buffer = event.target.result;
            const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, buffer.byteLength);
                const chunk = buffer.slice(start, end);
                
                try {
                    const {path} = await uploadChunk(id, chunk, i);
                    chunkPaths.push(path);
                    console.log(`Uploaded chunk ${i + 1} of ${totalChunks}`);
                } catch (error) {
                    reject(error);
                }
            }

            resolve({id: id, associated: chunkPaths});
        };

        fileReader.onerror = (error) => {
            reject(error);
        };

        fileReader.readAsArrayBuffer(file);
    });
}

export async function resizeAndCompress(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                const maxWidth = 800;
                const maxHeight = 800;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function(blob) {
                    resolve(blob);
                }, 'image/jpeg', 0.7);
            };

            img.onerror = function() {
                reject(new Error("Unable to load the image."));
            };

            img.src = event.target.result;
        };

        reader.onerror = function() {
            reject(new Error("Error reading the file."));
        };

        reader.readAsDataURL(file);
    });
}