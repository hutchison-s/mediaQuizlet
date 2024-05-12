import axios from "axios";

export async function resizeAndCompress(file: File): Promise<Blob> {
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
                ctx!.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob: Blob | null) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject("Error in compression")
                    }
                    
                }, 'image/jpeg', 0.7);
            };

            img.onerror = function() {
                reject(new Error("Unable to load the image."));
            };

            img.src = event!.target!.result as string;
        };

        reader.onerror = function() {
            reject(new Error("Error reading the file."));
        };

        reader.readAsDataURL(file);
    });
}

export async function compressAndUploadImage(file: File): Promise<{link: string, path: string}> {
    const compPhoto = await resizeAndCompress(file);
    const photoForm = new FormData();
    photoForm.append("photos", compPhoto, "photoUpload")
    const {link, path} = await axios.post(`http://localhost:8000/api/uploads/image/`, photoForm).then(res => res.data);
    return {link, path}
}