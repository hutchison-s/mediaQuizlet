import { apiURL } from "../urls.js"

export async function fileToLinkPath(file) {
    const url = apiURL+`/audio/upload`;
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
    const associated = [];

    const updatedQuestions = await Promise.all(questions.map(async q=>{
        const {file, ...otherProps} = q;
        const {link, path} = await fileToLinkPath(file);
        associated.push(path);
        return {file: link, ...otherProps}
    }))

    return [updatedQuestions, associated]
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